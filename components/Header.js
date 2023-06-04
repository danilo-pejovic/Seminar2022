import React from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text } from 'react-native';


// TO DO: Try to make more CUSTOM functional header in the future

function Header(props) {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {props.scene?.route?.name !== 'Home' && (
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <HeaderBackButton labelVisible={false} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{props.scene?.descriptor?.options?.title}</Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default Header;
