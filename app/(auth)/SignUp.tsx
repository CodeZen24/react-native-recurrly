import '@/global.css';
import { useSignUp } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

import { posthog } from '@/lib/posthog';

const SafeAreaView = styled(RNSafeAreaView);

// ─── Brand Block ─────────────────────────────────────────────────────────────
const BrandBlock = () => (
  <View className="auth-brand-block">
    <View className="auth-logo-wrap">
      <View className="auth-logo-mark">
        <Text className="auth-logo-mark-text">R</Text>
      </View>
      <View>
        <Text className="auth-wordmark">Recurly</Text>
        <Text className="auth-wordmark-sub">Smart Billing</Text>
      </View>
    </View>
  </View>
);

// ─── Password Strength Indicator ─────────────────────────────────────────────
const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  const bars = [1, 2, 3, 4];
  const colors: Record<number, string> = {
    1: '#dc2626', // destructive
    2: '#f97316', // orange
    3: '#eab308', // yellow
    4: '#16a34a', // success
  };
  const labels: Record<number, string> = {
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };

  return (
    <View className="gap-2">
      <View className="flex-row gap-1.5">
        {bars.map((bar) => (
          <View
            key={bar}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              backgroundColor: score >= bar ? colors[score] : 'rgba(0,0,0,0.1)',
            }}
          />
        ))}
      </View>
      <Text
        style={{ fontSize: 11, fontFamily: 'sans-medium', color: colors[score] }}
      >
        {labels[score]} password
      </Text>
    </View>
  );
};

// ─── Sign-Up Screen ───────────────────────────────────────────────────────────
const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const isFetching = fetchStatus === 'fetching';
  const canSubmit =
    firstName.trim().length > 0 &&
    emailAddress.trim().length > 0 &&
    password.length >= 8 &&
    !isFetching;

  // Navigate home after successful sign-up
  const navigateHome = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        posthog?.capture('account_created');
        const url = decorateUrl('/');
        router.replace(url as Href);
      },
    });
  };

  // Step 1: submit email + password
  const handleSignUp = async () => {
    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
      firstName: firstName.trim(),
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    // Send OTP to email for verification
    await signUp.verifications.sendEmailCode();
    posthog?.capture('sign_up_verification_requested');
  };

  // Step 2: verify email OTP
  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code: verificationCode });

    if (signUp.status === 'complete') {
      await navigateHome();
    } else {
      console.error('Sign-up not complete after verification:', signUp.status);
    }
  };

  // ── Email verification view ───────────────────────────────────────────────
  const isVerifying =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0;

  if (isVerifying) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="auth-scroll"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">
              <BrandBlock />

              <View className="mt-8 items-center">
                <Text className="auth-title">Check your inbox</Text>
                <Text className="auth-subtitle">
                  We sent a 6-digit code to{' '}
                  <Text className="font-sans-bold text-primary">{emailAddress}</Text>
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  {/* Code field */}
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={`auth-input${errors?.fields?.code ? ' auth-input-error' : ''}`}
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      placeholder="000000"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                      style={{ letterSpacing: 6, textAlign: 'center', fontSize: 20 }}
                    />
                    {errors?.fields?.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                  </View>

                  {/* Verify button */}
                  <Pressable
                    className={`auth-button${!verificationCode || isFetching ? ' auth-button-disabled' : ''}`}
                    onPress={handleVerify}
                    disabled={!verificationCode || isFetching}
                  >
                    {isFetching ? (
                      <ActivityIndicator color="#fff9e3" size="small" />
                    ) : (
                      <Text className="auth-button-text">Verify email</Text>
                    )}
                  </Pressable>

                  {/* Divider */}
                  <View className="auth-divider-row">
                    <View className="auth-divider-line" />
                    <Text className="auth-divider-text">or</Text>
                    <View className="auth-divider-line" />
                  </View>

                  {/* Resend */}
                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signUp.verifications.sendEmailCode()}
                    disabled={isFetching}
                  >
                    <Text className="auth-secondary-button-text">Resend code</Text>
                  </Pressable>

                  <Text className="auth-helper text-center">
                    Didn't get it? Check your spam folder.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Required for Expo web CAPTCHA — skipped on iOS/Android by Clerk */}
        <View nativeID="clerk-captcha" />
      </SafeAreaView>
    );
  }

  // ── Main sign-up form ─────────────────────────────────────────────────────
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="auth-scroll"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <BrandBlock />

            <View className="mt-8 items-center">
              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Start managing your subscriptions in seconds
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                {/* First name */}
                <View className="auth-field">
                  <Text className="auth-label">First name</Text>
                  <TextInput
                    className={`auth-input${errors?.fields?.firstName ? ' auth-input-error' : ''}`}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Your first name"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="given-name"
                    returnKeyType="next"
                  />
                  {errors?.fields?.firstName && (
                    <Text className="auth-error">{errors.fields.firstName.message}</Text>
                  )}
                </View>

                {/* Email */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input${errors?.fields?.emailAddress ? ' auth-input-error' : ''}`}
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="next"
                  />
                  {errors?.fields?.emailAddress && (
                    <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                  )}
                </View>

                {/* Password */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View className="relative">
                    <TextInput
                      className={`auth-input${errors?.fields?.password ? ' auth-input-error' : ''}`}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Minimum 8 characters"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      returnKeyType="done"
                      onSubmitEditing={canSubmit ? handleSignUp : undefined}
                    />
                    <Pressable
                      onPress={() => setPasswordVisible((v) => !v)}
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                      }}
                      hitSlop={8}
                    >
                      <Text className="text-sm font-sans-semibold text-accent">
                        {passwordVisible ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  </View>
                  {errors?.fields?.password && (
                    <Text className="auth-error">{errors.fields.password.message}</Text>
                  )}
                  <PasswordStrength password={password} />
                </View>

                {/* Global error */}
                {errors?.global?.[0] && (
                  <View className="rounded-2xl bg-destructive/10 px-4 py-3">
                    <Text className="text-sm font-sans-medium text-destructive">
                      {errors.global[0].message}
                    </Text>
                  </View>
                )}

                {/* Submit */}
                <Pressable
                  className={`auth-button${!canSubmit ? ' auth-button-disabled' : ''}`}
                  onPress={handleSignUp}
                  disabled={!canSubmit}
                >
                  {isFetching ? (
                    <ActivityIndicator color="#fff9e3" size="small" />
                  ) : (
                    <Text className="auth-button-text">Get started</Text>
                  )}
                </Pressable>

                {/* Sign in link */}
                <View className="auth-link-row">
                  <Text className="auth-link-copy">Already have an account?</Text>
                  <Link href="/(auth)/SignIn" asChild>
                    <Pressable>
                      <Text className="auth-link">Sign in</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>

            {/* Terms notice */}
            <Text className="mt-5 text-center text-xs font-sans-medium text-muted-foreground">
              By continuing, you agree to Recurly's{' '}
              <Text className="font-sans-semibold text-primary">Terms of Service</Text>
              {' '}and{' '}
              <Text className="font-sans-semibold text-primary">Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Required for Expo web CAPTCHA — skipped on iOS/Android by Clerk */}
      <View nativeID="clerk-captcha" />
    </SafeAreaView>
  );
};

export default SignUp;