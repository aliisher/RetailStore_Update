import { Colors } from '../Constants/Colors';
import { Fonts, fontSize } from '../Constants/Fonts';
import { wp, isMobileScreen, windowWidth, hp } from '../Constants/Responsive';

/** ~one fifth of screen minus gutters — keeps long labels on one line when paired with adjustsFontSizeToFit */
const tabLabelWidth = Math.max(windowWidth / 5 - wp(3), 56);

const mobileResponsive = focused => ({
  textStyle: {
    color: focused ? Colors.primary : Colors.spanishGrey,
    fontSize: fontSize.XS,
    fontFamily: Fonts.medium,
    marginTop: wp(0.35),
    textAlign: 'center',
    width: tabLabelWidth,
  },
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: focused ? Colors.whiteSmoke : null,
    padding: focused ? wp(2.4) : wp(0.35),
    borderRadius: focused ? wp(10) : wp(0),
    borderColor: focused ? Colors.white : null,
    borderWidth: focused ? wp(0.35) : wp(0),
  },
});

const tabletResponsive = focused => ({
  textStyle: {
    color: focused ? Colors.primary : Colors.spanishGrey,
    fontSize: fontSize.XXS,
    fontFamily: Fonts.medium,
    marginTop: wp(0.25),
    textAlign: 'center',
    width: tabLabelWidth,
  },
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: focused ? Colors.whiteSmoke : null,
    padding: focused ? hp('1.8%') : hp('0.4%'),
    borderRadius: focused ? wp(10) : wp(0),
    borderColor: focused ? Colors.white : null,
    borderWidth: focused ? wp(0.35) : wp(0),
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
