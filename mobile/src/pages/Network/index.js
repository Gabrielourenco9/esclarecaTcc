import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, FlatList, ActivityIndicator, TextInput, Image, AsyncStorage } from 'react-native';
import { Feather, FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'

import styles from './styles'
import { showError, showSucess } from '../../common'
import api from '../../services/api'
import { handleLimitBigText } from '../../common'

export default function Network() {
    const navigation = useNavigation()
    const [users, setUsers] = useState([])
    const [blockedUsers, setBlockedUsers] = useState([])
    const [modoTela, setModoTela] = useState('todos')

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadPage()
        async function loadPage() {
            await loadBlockedFollowedUsers()
            await reloadUsers()
        }
    }, [])

    async function loadBlockedFollowedUsers() {
        const usuarioAtual = await AsyncStorage.getItem('user');
        const response = await api.get(`/users/${usuarioAtual}`, {})
        if (response.data) {
            const blocks = []
            response.data.blocked.forEach(element => {
                blocks.push(element._id)
            });
            setBlockedUsers(blocks)
        }
        // Falta adicionar o array de seguindo no perfil, e carregar estas informações aqui
    }

    async function loadUsers() {
        if (loading) {//Impede que uma busca aconteça enquanto uma requisição já foi feita
            return
        }

        if (total > 0 && users.length == total) {//Impede que faça a requisição caso a qtd máxima já tenha sido atingida
            return
        }

        try {
            const response = await api.get(`/users`, {
                headers: { search_text: searchText },
                params: { page }
            })

            if (response.status == 200) {
                setUsers([...users, ...response.data])
                setPage(page + 1)
                setTotal(response.headers['x-total-count'])
            } else {
                showError(response.data)
            }

            setLoading(false)//Conclui o load
        }
        catch (e) {
            showError(e)
        }
    }
    async function reloadUsers() {
        if (refreshing) {//Impede que uma busca aconteça enquanto uma requisição já foi feita
            return
        }

        try {
            const response = await api.get(`/users`, {
                headers: { search_text: searchText },
                params: { page: 1 }
            })

            if (response.status == 200) {
                setUsers(response.data)
                setPage(2)
                setTotal(response.headers['x-total-count'])
            } else {
                showError(response.data)
            }

            setRefreshing(false)//Conclui o load
        }
        catch (e) {
            showError(e)
        }
    }
    async function blockDesblockUser(uId) {
        try {
            const usuarioAtual = await AsyncStorage.getItem('user');

            const response = await api.post(`/users/${uId}/block`, {}, { headers: { user_id: usuarioAtual } })
            console.log(response.status)
            console.log(response.data)
            if (response.status == 204) {
                showSucess("Usuário bloqueado com sucesso")
            } else if (response.status == 201) {
                showSucess("Usuário desbloqueado com sucesso")
            }
            else if (response.status == 205) {
                showSucess("Não é possível bloquear você mesmo!")
            }
            else {
                showError("Ocorreu um erro ao processar a requisição!")
            }
            await loadBlockedFollowedUsers()
            await reloadUsers()
        } catch (e) {
            showError("Erro: " +e)
        }
    }
    renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loading}>
                <ActivityIndicator />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Feather name="menu" size={20} color="#FFC300"></Feather>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20, marginRight: 5 }}>Conexões</Text>
                    <FontAwesome name="users" size={18} color="#FFC300" style={{ marginTop: 2 }} />
                </View>
            </View>

            <View style={styles.Search}>
                <TextInput
                    style={styles.input}
                    placeholder="Pesquise o usuário desejado..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={searchText}
                    onChangeText={setSearchText}
                    multiline={true}
                    numberOfLines={2}
                    returnKeyType="done"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TouchableOpacity onPress={reloadUsers}>
                        <Feather name="search" size={18} color="#FFC300" style={{ marginTop: 2, marginRight: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ alignItems: 'center', top: 5, marginBottom: 5, paddingHorizontal: '4%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => setModoTela('todos')}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: modoTela === 'todos' ? '#FFC300' : '#365478' }}>Todos os Usuários</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => setModoTela('bloqs')}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: modoTela === 'bloqs' ? '#FFC300' : '#365478' }}>Bloqueados</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModoTela('follow')}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: modoTela === 'follow' ? '#FFC300' : '#365478' }}>Seguidos</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={users}
                keyExtractor={user => String(user._id)}
                refreshing={refreshing}
                onRefresh={reloadUsers}
                onEndReached={loadUsers}
                onEndReachedThreshold={0.2}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: user }) => (

                    <Animatable.View
                        style={styles.post}
                        animation="fadeInDown"
                        duration={1000}
                    >
                        {modoTela === 'todos' || modoTela === 'bloqs' && blockedUsers.includes(user._id) ?
                            <View style={styles.postHeader}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Image style={styles.avatar} source={{ uri: user.url ? `${user.url}?${new Date().getTime()}` : 'https://www.colegiodepadua.com.br/img/user.png' }} />
                                        <View style={{ marginLeft: 5 }}>
                                            <Text style={{ fontSize: 14, color: '#365478', fontWeight: 'bold' }}>{user.name}</Text>
                                            <Text style={styles.postTag}>{handleLimitBigText(user.tags.toString(','), 20)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 25 }}>
                                            <Feather name="award" size={17} color="#F5B7B1" />
                                            <Text style={{ fontSize: 12, color: '#F5B7B1' }}>{user.ranking} pontos</Text>
                                        </View>
                                        {!blockedUsers.includes(user._id) ?
                                            <>
                                                <TouchableOpacity onPress={() =>
                                                    Alert.alert(
                                                        'Bloquear',
                                                        'Deseja realmente bloquear o usuário?',
                                                        [
                                                            { text: 'Não', onPress: () => { return null } },
                                                            { text: 'Sim', onPress: () => { blockDesblockUser(user._id) } },
                                                        ],
                                                        { cancelable: false }
                                                    )}>
                                                    <Feather name="slash" size={20} color="#E73751"></Feather>
                                                </TouchableOpacity>

                                                {/* <TouchableOpacity style={{ paddingLeft: 10 }}>
                                                    <Feather name="user-minus" size={20} color="#E73751" />
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{ paddingLeft: 10 }}>
                                                    <Feather name="user-plus" size={20} color="#7DCEA0" />
                                                </TouchableOpacity> */}
                                            </>
                                            : null}
                                        {blockedUsers.includes(user._id) ?
                                            <TouchableOpacity onPress={() =>
                                                Alert.alert(
                                                    'Bloquear',
                                                    'Deseja realmente desbloquear o usuário?',
                                                    [
                                                        { text: 'Não', onPress: () => { return null } },
                                                        { text: 'Sim', onPress: () => { blockDesblockUser(user._id) } },
                                                    ],
                                                    { cancelable: false }
                                                )}>
                                                <Feather name="check-circle" size={20} color="#7DCEA0"></Feather>
                                            </TouchableOpacity>
                                            : null}
                                    </View>
                                </View>
                            </View>
                            : null}
                    </Animatable.View>
                )
                }>
            </FlatList >
        </View >
    )
}