import '@/global.css';
import { useSignIn } from '@clerk/expo';
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

// ─── Sign-In Form ─────────────────────────────────────────────────────────────
const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const isFetching = fetchStatus === 'fetching';
  const canSubmit = emailAddress.trim().length > 0 && password.length > 0 && !isFetching;

  // Navigate to home after successful sign-in
  const navigateHome = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl('/');
        router.replace(url as Href);
      },
    });
  };

  // Primary sign-in handler
  const handleSignIn = async () => {
    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === 'complete') {
      await navigateHome();
    } else if (signIn.status === 'needs_client_trust') {
      // Device trust — send email code for verification
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (f) => f.strategy === 'email_code'
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    }
    // 'needs_second_factor' is handled by the verification view below
  };

  // MFA / Device trust code verification
  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code: mfaCode });

    if (signIn.status === 'complete') {
      await navigateHome();
    } else {
      console.error('Sign-in not complete after verification:', signIn.status);
    }
  };

  // ── Device-trust / MFA verification view ──────────────────────────────────
  if (signIn.status === 'needs_client_trust' || signIn.status === 'needs_second_factor') {
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
                <Text className="auth-title">Verify your device</Text>
                <Text className="auth-subtitle">
                  A verification code has been sent to{' '}
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
                      value={mfaCode}
                      onChangeText={setMfaCode}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />
                    {errors?.fields?.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                  </View>

                  {/* Verify button */}
                  <Pressable
                    className={`auth-button${!mfaCode || isFetching ? ' auth-button-disabled' : ''}`}
                    onPress={handleVerify}
                    disabled={!mfaCode || isFetching}
                  >
                    {isFetching ? (
                      <ActivityIndicator color="#fff9e3" size="small" />
                    ) : (
                      <Text className="auth-button-text">Verify</Text>
                    )}
                  </Pressable>

                  {/* Resend + start over */}
                  <View className="auth-divider-row">
                    <View className="auth-divider-line" />
                    <Text className="auth-divider-text">or</Text>
                    <View className="auth-divider-line" />
                  </View>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.mfa.sendEmailCode()}
                    disabled={isFetching}
                  >
                    <Text className="auth-secondary-button-text">Resend code</Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.reset()}
                    disabled={isFetching}
                  >
                    <Text className="auth-secondary-button-text">Start over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Main sign-in form ──────────────────────────────────────────────────────
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
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                {/* Email field */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input${errors?.fields?.identifier ? ' auth-input-error' : ''}`}
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
                  {errors?.fields?.identifier && (
                    <Text className="auth-error">{errors.fields.identifier.message}</Text>
                  )}
                </View>

                {/* Password field */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View className="relative">
                    <TextInput
                      className={`auth-input${errors?.fields?.password ? ' auth-input-error' : ''}`}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="current-password"
                      returnKeyType="done"
                      onSubmitEditing={canSubmit ? handleSignIn : undefined}
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
                </View>

                {/* General error (e.g. wrong credentials) */}
                {errors?.global?.[0] && (
                  <View className="rounded-2xl bg-destructive/10 px-4 py-3">
                    <Text className="text-sm font-sans-medium text-destructive">
                      {errors.global[0].message}
                    </Text>
                  </View>
                )}

                {/* Sign in button */}
                <Pressable
                  className={`auth-button${!canSubmit ? ' auth-button-disabled' : ''}`}
                  onPress={handleSignIn}
                  disabled={!canSubmit}
                >
                  {isFetching ? (
                    <ActivityIndicator color="#fff9e3" size="small" />
                  ) : (
                    <Text className="auth-button-text">Sign in</Text>
                  )}
                </Pressable>

                {/* Sign up link */}
                <View className="auth-link-row">
                  <Text className="auth-link-copy">New to Recurly?</Text>
                  <Link href="/(auth)/SignUp" asChild>
                    <Pressable>
                      <Text className="auth-link">Create an account</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;