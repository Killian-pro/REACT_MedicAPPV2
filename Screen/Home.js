import * as React from 'react';
import { useState, useEffect } from 'react'
import { View, Text } from 'react-native';
import MedicamentCase from './MedicamentCase'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';

var db = openDatabase({
    name: 'medic',
    createFromLocation: '~www/medic.db',
    });
    
function HomeScreen({ navigation }) {
    
    useEffect(() => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='medic'",
                [],
                function (tx, res) {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        // txn.executeSql('DROP TABLE IF EXISTS table_medic', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_medic(medic_id INTEGER PRIMARY KEY AUTOINCREMENT, medic_name VARCHAR(20), medic_heure INT(10))',
                            [],
                        );
                    }
                },
            );
        });
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='prise'",
                [],
                function (tx, res) {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        // txn.executeSql('DROP TABLE IF EXISTS table_prise', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_prise(prise_id INTEGER PRIMARY KEY AUTOINCREMENT,prise_medicid INT(10),prise_jour VARCHAR(20) ,prise_mois VARCHAR(20) ,prise_annee VARCHAR(20) ,prise_time VARCHAR(100))',
                            [],
                        );
                    }
                },
            );
        });
    }, []);

    return (
        <>
            <View style={{ backgroundColor: '#74B72E', height: 100, width: '100%' }}></View>
            <View style={{ margin: 30, width: "85%" }}>
                <MedicamentCase navigation={navigation} />
                <TouchableOpacity onPress={() => { navigation.navigate('Add') }} style={{ borderWidth: 2, borderRadius: 20, margin: 3, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00804F' }}>
                    <Icon name="add-outline" style={{ fontSize: 30, color: 'white',paddingRight:10 }} />
                    <Text style={{ fontSize: 20, color: 'white' }}>Ajouter un médicament</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default HomeScreen