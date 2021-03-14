
import * as React from 'react';
import { useState, useEffect } from 'react'
import { View, Text, TextInput, Alert,ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';

var db = openDatabase({
    name: 'medic',
    createFromLocation: '~www/medic.db',
    });

function Add({ navigation }) {
    const [titre, SetTitre] = useState('');
    const [heure, SetHeure] = useState('');
    const [description, setDescription] = useState('');
    let newDate = new Date().getFullYear()

    const ajouterUnMedicament= () => {
        if (titre === '') {
            alert('entrer le nom du médicament')
            return
        }
        if (heure === '') {
            SetHeure(0)
        }
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO table_medic (medic_name, medic_heure) VALUES (?,?)',
                [titre, heure],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        // Alert.alert(
                        //     'Success',
                        //     'You are Registered Successfully',
                        //     [
                        //         {
                        //             text: 'Ok',
                        //             onPress: () => navigation.navigate('Home'),
                        //         },
                        //     ],
                        //     { cancelable: false },
                        // );
                        navigation.navigate('Home')
                    } else alert('Non enregistré');
                },
            );
        });
    }
    return (
        <>
            <View style={{ backgroundColor: '#74B72E', height: 100, width: '100%', paddingTop: 50, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-back-outline" style={{ fontSize: 30, color: 'white', marginRight: '33%' ,marginLeft:10  }} /></TouchableOpacity>
            </View>
            <View style={{  alignItems: 'center', marginTop:50 }}>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10, width: '80%', textAlign: 'center', marginBottom: 10 }}
                    placeholder='Nom du médicament'
                    onChangeText={titre => SetTitre(titre)}
                    value={titre}
                />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10, width: '80%', textAlign: 'center', marginBottom: 10 }}
                    placeholder='Temps entre deux prises'
                    keyboardType='numeric'
                    onChangeText={heure => SetHeure(heure)}
                    value={heure}
                />
                 <TextInput
                    style={{ height: 'auto',maxHeight:200, borderColor: 'gray', borderWidth: 1, borderRadius: 10, width: '80%', textAlign: 'center', marginBottom: 10,marginTop:30 }}
                    placeholder='Description du médicament'
                    onChangeText={description => setDescription(description)}
                    multiline={true}
                    value={description}
                />
                <TouchableOpacity onPress={() => ajouterUnMedicament()} style={{ marginTop: '50%', borderWidth: 2, borderRadius: 10, width: 100, alignItems: 'center', backgroundColor: '#00804F' }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Valider</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default Add