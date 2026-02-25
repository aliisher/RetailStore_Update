import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/Header';
import {mainContainer} from '../../Constants/StyleSheet';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {
  wp,
  hp,
  isMobileScreen,
  windowWidth,
  windowHeight,
} from '../../Constants/Responsive';
import {useIsFocused} from '@react-navigation/native';
import {request} from '../../Api_Services/ApiServices';

const Contacts = () => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isFocused) {
      getEmail();
    }
  }, [isFocused]);

  const getEmail = async () => {
    setLoading(true);
    try {
      const response = await request.get(`email`);
      if (response?.status === 200) {
        setEmail(response?.data?.email);
      }
    } catch (err) {
      console.log('Error@', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={mainContainer}>
      <Header title="Contact" titleStyle={styles.titleStyle} />
      <View style={styles.contactConatiner}>
        <Text style={styles.heading}>Contact us for any query</Text>
      </View>
      <TouchableOpacity
        style={styles.mailContainer}
        onPress={() => !loading && email && Linking.openURL(`mailto:${email}`)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Text style={styles.mailText}>{email || 'Loading...'}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  contactConatiner: {
    width: isMobileScreen ? wp(90) : windowWidth * 0.9,
    marginTop: isMobileScreen ? wp(15) : windowWidth * 0.09,
  },
  heading: {
    color: Colors.black,
    fontSize: fontSize.Normal1,
    fontFamily: Fonts.bold,
  },
  mailContainer: {
    width: isMobileScreen ? wp(90) : windowWidth * 0.9,
    height: isMobileScreen ? hp(5) : windowHeight * 0.1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    borderRadius: isMobileScreen ? wp(10) : windowWidth * 0.1,
    marginTop: isMobileScreen ? hp(2) : windowHeight * 0.02,
    marginRight: isMobileScreen ? wp(1) : windowWidth * 0.01,
  },
  mailText: {
    color: Colors.white,
    fontFamily: Fonts.medium,
    marginHorizontal: isMobileScreen ? hp(2) : windowHeight * 0.02,
    fontSize: fontSize.S1,
  },
});
