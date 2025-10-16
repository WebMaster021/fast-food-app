import {View, Text, Button} from 'react-native';
import {router} from "expo-router";

const SignUp = () => {
    return (
        <View>
            <Text>Sign up</Text>
            <Button title="Sign up" onPress={() => router.push("/sign-in")} />
        </View>
    )
}

export default SignUp;