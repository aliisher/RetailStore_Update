import {Colors} from '../Constants/Colors';
import {Fonts, fontSize} from '../Constants/Fonts';
import {wp, isMobileScreen, windowWidth, hp} from '../Constants/Responsive';

const mobileResponsive = focused => ({
  textStyle: {
    color: focused ? Colors.primary : Colors.spanishGrey,
    bottom: focused ? wp(5.5) : wp(0),
    fontSize: fontSize.XXS,
    fontFamily: Fonts.medium,
    marginTop: wp(0.5),
  },
  viewStyle: {
    bottom: focused ? wp(6) : wp(0.5),
    backgroundColor: focused ? Colors.whiteSmoke : null,
    padding: focused ? wp(4.5) : wp(0),
    borderRadius: focused ? wp(10) : wp(0),
    borderColor: focused ? Colors.white : null,
    borderWidth: focused ? wp(1) : wp(0),
  },
});

const tabletResponsive = focused => ({
  textStyle: {
    color: focused ? Colors.primary : Colors.spanishGrey,
    bottom: focused ? windowWidth * 0.03 : windowWidth * 0,
    fontSize: fontSize.XXS,
    fontFamily: Fonts.medium,
    marginTop: wp(0.2),
    textAlign: 'center',
    width: windowWidth * 0.1,
  },
  viewStyle: {
    bottom: focused ? windowWidth * 0.03 : windowWidth * 0.001,
    backgroundColor: focused ? Colors.whiteSmoke : null,
    padding: focused ? hp('4%') : windowWidth * 0,
    borderRadius: focused ? windowWidth * 2 : windowWidth * 0,
    borderColor: focused ? Colors.white : null,
    borderWidth: focused ? wp('.5%') : windowWidth * 0,
  },
});

export const bottomStyle = focused => {
  const responsiveStyles = isMobileScreen
    ? mobileResponsive(focused)
    : tabletResponsive(focused);
  return {
    textStyle: {
      ...responsiveStyles.textStyle,
    },
    viewStyle: {
      ...responsiveStyles.viewStyle,
    },
  };
};
