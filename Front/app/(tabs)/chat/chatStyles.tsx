import {StyleSheet} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
    sendButton:{
        backgroundColor: Colors.primary,
        color: Colors.white,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginRight: 5,
    },
    input:{
        width: '100%',
        height: 40,
        borderColor: '#848484',
        borderWidth: 1,
        borderWidth:1,
        marginTop: '3%',
        marginBottom: '5%',
        padding: 10,
    },
    changNameView:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
        backgroundColor: 'white' 
    },
    container:{
        marginTop: 16,
        marginHorizontal: 16,
    },
    scrollViewContainer:{
        padding: 10,
        top: 10,
    },
    messageTextInputContainer:{
        justifyContent: 'flex-end',
        padding: 5,
        borderColor: 'transparent',
        borderTopColor: Colors.light,
        alignItems: 'center',
        flexDirection: 'row',
    },
    messageTextInput:{
        flex: 1,
        minHeight: 40,
        maxHeight: 90,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        fontSize: 17,
        borderColor: Colors.light,
        borderWidth: 1,
        backgroundColor: Colors.white,
        borderRadius: 20,
    },
})
export default styles;