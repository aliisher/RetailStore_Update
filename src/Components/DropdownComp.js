import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from '../Constants/Responsive';
import {Colors} from '../Constants/Colors';
import {Fonts, fontSize} from '../Constants/Fonts';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {storeImg} from '../Assets/Index';

const DropdownComp = props => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const disabled = props?.disabled || false;

  const renderLabel = () => {
    return (
      <View style={props?.label}>
        <View
          style={[
            {flexDirection: 'row', alignItems: 'center'},
            props?.labelStyle,
          ]}>
          <Text style={styles.titleStyling}>{props?.titleLabel}</Text>

          {props?.optionalText && (
            <Text style={styles.optionalStyling}> {props?.optionalText}</Text>
          )}
        </View>
      </View>
    );
  };
  return (
    <View style={props?.mainStyling}>
      <View
        style={{
          marginVertical: hp(1),
        }}>
        {renderLabel()}
        <Dropdown
          style={[
            styles.dropdown,
            {
              borderColor: isFocus ? Colors.primary : Colors.spanishGrey,
              width: props?.width || wp(90),
            },
            props?.dropdown,
          ]}
          placeholderStyle={[
            styles.placeholderStyle,
            {
              color: props?.placeholderColor || Colors.spanishGrey,
            },
          ]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            {
              color: props?.selectedTextStyle || Colors.primary,
              fontFamily:Fonts.p_Medium,
              fontSize:fontSize.M
            },
          ]}
          inputSearchStyle={styles.inputSearchStyle}
          data={props?.data}
          search={props?.search || false}
          maxHeight={300}
          labelField={props?.labelField}
          valueField={props?.valueField}
          placeholder={!isFocus ? props?.placeholder : '...'}
          searchPlaceholder="Search..."
          value={props?.value || value}
          itemTextStyle={styles.itemTextStyle}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            props.onChange(item);
            setValue(item.value);
            setIsFocus(false);
          }}
          disable={disabled}
          renderLeftIcon={() => (
            <Image source={storeImg} style={styles.imgStyle} />
          )}
          renderRightIcon={() => {
            return props?.indicator ? (
              <ActivityIndicator size="small" color={Colors.spanishGrey} />
            ) : (
              <AntDesign
                style={styles.icon}
                color={Colors.spanishGrey}
                name={'down'}
                size={18}
              />
            );
          }}
        />
      </View>

      {props.errMessage && (
        <View>
          <Text style={styles.errMessage}>{props.errMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default DropdownComp;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: wp(2),
    backgroundColor: Colors.whiteSmoke,
    elevation: wp(0.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: wp(3),
    alignItems: 'center',
    borderWidth: wp(0.3),
  },
  optionalStyling: {
    fontFamily: Fonts.p_Medium,
    fontSize: fontSize.S,
  },
  titleStyling: {
    color: Colors.chineseBlack,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.M1,
    marginLeft: wp(0.5),
  },
  icon: {
    marginRight: 5,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderStyle: {
    fontSize: fontSize.S1,
    color: Colors.white,
    fontFamily: Fonts.regular,
    marginLeft: wp(2),
  },
  selectedTextStyle: {
    fontSize: fontSize.S,
    fontFamily: Fonts.regular,
    marginLeft: wp(2),
  },
  iconStyle: {
    width: hp(4),
    height: hp(4),
    tintColor: Colors.darkSilver,
  },
  inputSearchStyle: {
    fontSize: fontSize.XS,
    fontFamily: Fonts.p_Regular,
    color: Colors.black,
    borderColor: 'red',
  },
  itemTextStyle: {
    color: Colors.black,
    fontFamily: Fonts.p_Semibold,
    fontSize: fontSize.S,
  },
  errMessage: {
    color: Colors.secondary,
    marginLeft: wp(3),
    width: wp(85),
  },
  imgStyle: {
    width: wp(4),
    height: wp(4),
    tintColor: Colors.spanishGrey,
  },
});
