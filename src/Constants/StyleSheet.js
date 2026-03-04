import { Colors } from './Colors';
import { hp, wp } from './Responsive';

export const mainContainer = {
  // width:wp(90),
  flex: 1,
  marginTop: hp(1),
  alignItems: 'center',
  backgroundColor: Colors.white,
};
export const bottomContainer = {
  alignItems: 'center',
};
export const imageStyle = {
  width: wp(5),
  height: wp(5),
};
