import { useThemeStore } from '@/store/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

interface ScreenLayoutProps extends ViewProps {
    children: React.ReactNode;
    withGradient?: boolean;
    edges?: SafeAreaViewProps['edges'];
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
    children,
    withGradient = false,
    edges = ['top'],
    className = '',
    ...props
}) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const BackgroundColor = isDark ? '#18181B' : '#F9FAFB'; // zinc-900 or gray-50

    const Content = (
        <SafeAreaView
            edges={edges}
            className={`flex-1 ${className}`}
            {...props}
        >
            <StatusBar style={isDark ? 'light' : 'dark'} />
            {children}
        </SafeAreaView>
    );

    if (withGradient && !isDark) {
        return (
            <LinearGradient
                colors={['#F5F3FF', '#ECFEFF', '#FFFFFF']} // primary-50 to secondary-50 to white
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                {Content}
            </LinearGradient>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: BackgroundColor }}>
            {Content}
        </View>
    );
};
