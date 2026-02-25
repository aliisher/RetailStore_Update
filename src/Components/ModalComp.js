import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Btn from './Btn';
import {hp, wp} from '../Constants/Responsive';
import {Colors} from '../Constants/Colors';
import {fontSize} from '../Constants/Fonts';

const ModalComp = props => {
  return (
    <Modal
      visible={props?.isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => props?.isVisible}>
      <TouchableWithoutFeedback>
        <View style={styles.mainView}>
          <View style={styles.modalBody}>
            <Btn text={'Recommended'} fontSize={fontSize.L} width={wp(70)} />
            <Btn
              marginTop={hp(5)}
              width={wp(70)}
              text={'Manual'}
              fontSize={fontSize.L}
              textColor={Colors.primary}
              backgroundColor={Colors.white}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalComp;

const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: Colors.white,
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(5),
    borderRadius: hp(1),
    width: wp(89),
  },
  mainView: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
