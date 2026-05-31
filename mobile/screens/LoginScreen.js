import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://ashura-forge-api.onrender.com';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [apiLog, setApiLog]     = useState(null);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('E-posta ve şifre zorunludur.'); return; }
    setLoading(true); setError(''); setApiLog(null);
    const endpoint = `${API_URL}/api/Auth/login`;
    const payload  = { email, password };
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, payload });
    try {
      const res = await axios.post(endpoint, payload);
      setApiLog({ status: '200 OK', endpoint, payload, response: { token: res.data.data.token.substring(0, 40) + '...' } });
      navigation.replace('Main', { token: res.data.data.token });
    } catch (err) {
      const status = err.response?.status || 'Bağlantı hatası';
      setApiLog({ status: `${status}`, endpoint, payload, response: err.response?.data || 'Sunucuya ulaşılamadı' });
      setError(err.response?.data?.message || 'E-posta veya şifre hatalı.');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* LOGO */}
          <View style={s.logoWrap}>
            <LinearGradient colors={['#f97316', '#f59e0b']} style={s.logoBox} start={[0,0]} end={[1,1]}>
              <MaterialCommunityIcons name="dumbbell" size={52} color="#000" />
            </LinearGradient>
            <Text style={s.title}>ASHURA FORGE</Text>
            <Text style={s.subtitle}>SAVAŞA HAZIR MISIN?</Text>
          </View>

          {/* HATA */}
          {!!error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠  {error.toUpperCase()}</Text>
            </View>
          )}

          {/* FORM KARTI */}
          <View style={s.card}>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" style={s.inputIcon} />
              <TextInput style={s.input} placeholder="E-posta Adresi" placeholderTextColor="#4b5563"
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={s.inputIcon} />
              <TextInput style={s.input} placeholder="Şifre" placeholderTextColor="#4b5563"
                value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            <LinearGradient colors={['#f97316','#f59e0b','#f97316']} style={s.btnGrad} start={[0,0]} end={[1,0]}>
              <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#000" /> :
                  <View style={s.btnInner}>
                    <Text style={s.btnText}>GİRİŞ YAP</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                  </View>
                }
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity onPress={() => { navigation.navigate('Register'); setError(''); }}>
              <Text style={s.switchText}>Hesabın yok mu?{' '}
                <Text style={s.link}>Hemen oluştur</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* API LOG */}
          {apiLog && (
            <View style={s.logBox}>
              <Text style={s.logTitle}>API ISTEK / YANIT</Text>
              <Text style={s.logRow}><Text style={s.logKey}>Endpoint: </Text>{apiLog.endpoint}</Text>
              <Text style={s.logRow}><Text style={s.logKey}>Istek: </Text>{JSON.stringify(apiLog.payload)}</Text>
              <Text style={[s.logRow, { color: apiLog.status === '200 OK' ? '#4ade80' : apiLog.status.includes('GÖN') ? '#f59e0b' : '#f87171' }]}>
                <Text style={s.logKey}>Durum: </Text>{apiLog.status}
              </Text>
              {apiLog.response && <Text style={s.logRow}><Text style={s.logKey}>Yanit: </Text>{JSON.stringify(apiLog.response)}</Text>}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#000' },
  scroll:     { padding: 24, paddingTop: 52 },
  logoWrap:   { alignItems: 'center', marginBottom: 44 },
  logoBox:    { width: 96, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#f97316', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 24, elevation: 20 },
  title:      { fontSize: 38, fontWeight: '900', color: '#f97316', letterSpacing: 3, marginBottom: 6 },
  subtitle:   { fontSize: 12, color: '#6b7280', fontWeight: '800', letterSpacing: 3 },
  errorBox:   { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1.5, borderColor: 'rgba(239,68,68,0.4)', borderRadius: 14, padding: 14, marginBottom: 16 },
  errorText:  { color: '#f87171', fontSize: 12, fontWeight: '900', textAlign: 'center', letterSpacing: 1 },
  card:       { backgroundColor: '#0d0d0d', borderRadius: 28, padding: 24, borderWidth: 1.5, borderColor: 'rgba(249,115,22,0.2)', shadowColor: '#f97316', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 32, elevation: 14 },
  inputWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', borderWidth: 2, borderColor: '#1f2937', borderRadius: 16, paddingHorizontal: 14, marginBottom: 14 },
  inputIcon:  { marginRight: 10 },
  input:      { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 16, fontWeight: '600' },
  btnGrad:    { borderRadius: 16, marginTop: 10, marginBottom: 20, shadowColor: '#f97316', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 12 },
  btn:        { paddingVertical: 18, alignItems: 'center' },
  btnInner:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnText:    { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 2 },
  switchText: { textAlign: 'center', color: '#6b7280', fontSize: 14, fontWeight: '600' },
  link:       { color: '#f97316', fontWeight: '800' },
  logBox:     { marginTop: 24, backgroundColor: '#080808', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(249,115,22,0.25)' },
  logTitle:   { color: '#f97316', fontWeight: '900', fontSize: 11, marginBottom: 10, letterSpacing: 3 },
  logRow:     { color: '#6b7280', fontSize: 11, marginBottom: 5, lineHeight: 17 },
  logKey:     { color: '#f59e0b', fontWeight: '700' },
});
