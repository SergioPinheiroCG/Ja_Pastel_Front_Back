import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    slogan: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'yellow',
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        width: '90%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 10, // Espaço entre os campos
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: 'black',
    },
    buttonLogin: {
        backgroundColor: 'red',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'red',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonTextRegister: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 0, // Espaço entre o campo e o aviso
        marginLeft: 10, // Alinhado à esquerda
    },
});
