const CustomHeader = ({ navigation, loggedIn }) => {
    return (
      <Header>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text>Username</Text>
          </TouchableOpacity>
          {loggedIn ? (
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text>Log Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text>Log In</Text>
            </TouchableOpacity>
          )}
        </View>
      </Header>
    );
  };
  
  export default CustomHeader;