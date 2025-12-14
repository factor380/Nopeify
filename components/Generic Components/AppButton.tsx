import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    TextStyle,
    ViewStyle,
    StyleProp,
} from 'react-native';
// ייבוא של ספריית אייקונים (לדוגמה, FontAwesome או Vector Icons)
import Icon from 'react-native-vector-icons/FontAwesome'; 

// הגדרת ה-Props של הקומפוננטה
interface AppButtonProps {
    title: string;
    onPress: () => void;
    // optional: loading state
    isLoading?: boolean;
    // optional: disabled state (explicit)
    disabled?: boolean;
    // optional: icon name (react-native-vector-icons)
    iconName?: string;
    // optional: icon position
    iconPosition?: 'left' | 'right';
    // optional: button color
    color?: string;
    // optional: icon color
    iconColor?: string;
    // optional: variant
    variant?: 'solid' | 'outline';
    // optional: custom styles
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    // optional: test/accessibility
    accessibilityLabel?: string;
    testID?: string;
}

function AppButton({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    iconName,
    iconPosition = 'left',
    color = '#4CAF50', // default green
    iconColor = '#fff',
    variant = 'solid',
    style,
    textStyle,
    accessibilityLabel,
    testID,
}: AppButtonProps) {

    // disabled when explicitly disabled or loading
    const isDisabled = disabled || isLoading;

    // compute icon color dynamically based on variant if not provided
    const effectiveIconColor = iconColor || (variant === 'outline' ? color : '#fff');

    // רנדור האייקון
    const renderIcon = () => {
        if (!iconName) return null;

        return (
            <Icon
                name={iconName}
                size={18}
                color={effectiveIconColor}
                style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
            />
        );
    };

    // רנדור התוכן הפנימי (טקסט, אייקון, או לואדר)
    const renderContent = () => {
        if (isLoading) {
        return (
            <View style={[styles.contentContainer, { opacity: 1 }]}> 
                <ActivityIndicator color={variant === 'solid' ? '#fff' : color} size="small" />
            </View>
        );
    }

    return (
        <View style={styles.contentContainer}>
            {iconPosition === 'left' && renderIcon()}
            <Text
                style={[
                    styles.text,
                    variant === 'outline' ? { color } : null,
                    textStyle,
                ]}
            >
                {title}
            </Text>
            {iconPosition === 'right' && renderIcon()}
        </View>
    );
    };
    const buttonStyle = [
        styles.button,
        variant === 'outline'
            ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: color }
            : { backgroundColor: color },
        style,
        isDisabled && styles.disabledButton,
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            accessibilityLabel={accessibilityLabel || title}
            accessibilityState={{ disabled: isDisabled }}
            testID={testID}
        >
            {renderContent()}
        </TouchableOpacity>
    );
}

export default React.memo(AppButton);

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        minHeight: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3, // צל לאנדרואיד
    },
    disabledButton: {
        opacity: 0.6,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'none',
    },
    textOutline: {
        color: '#4CAF50',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});