import {StyleSheet} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import AppColors from './AppColor';

const BaseTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: AppColors.primary,
    accent: AppColors.accent,
    text: AppColors.textSecondary,
    fontFamily: 'Poppins-Medium',
  },
};

const Parent = {
  backgroundColor: AppColors.ghostWhite,
  flex: 1,
  fontFamily: 'Poppins-Bold',
};

const TextStyle = StyleSheet.create({
  titleExtraLarge: {
    fontSize: 24,
    color: AppColors.primaryTextColor,
    fontFamily: 'Poppins-Medium',
  },
  titleLarge: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: AppColors.primaryTextColor,
  },
  titleNormal: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  inputTextFont: {
    fontFamily: 'Poppins-Regular',
  },
  title: {
    fontFamily: 'Poppins-Medium',
  },

  subTitle: {fontFamily: 'Poppins-Regular'},

  titleSmall: {
    fontSize: 12,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins-ExtraLight ',
  },
  descNormalPrimary: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins-Medium',
  },
  descNormal: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontFamily: 'Poppins-Light',
  },
  descSmallPrimary: {
    fontSize: 12,
    color: AppColors.textPrimary,
    fontFamily: 'Poppins-Medium',
  },
  descSmall: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  optionMenuTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: AppColors.textPrimary,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  poppins: {
    fontFamily: 'Poppins-Medium',
  },
  secondaryFont: {
    fontFamily: 'Nunito-Medium',
  },
  semiBoldText: {
    fontFamily: 'NunitoSans-SemiBold',
  },
});

export default {
  BaseTheme,
  Parent,
  TextStyle,
};
