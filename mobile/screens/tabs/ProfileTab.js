import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'https://ashura-forge-api.onrender.com';

function GlowCard({ glowColor = '#f97316', style, children }) {
  return (
    <View style={[{ borderRadius: 24, padding: 2, backgroundColor: glowColor + '22' }, style]}>
      <View style={{ backgroundColor: '#0d0d0d', borderRadius: 22, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

function StatPill({ icon, value, label, color }) {
  return (
    <View style={[sp.pill, { borderColor: color + '30' }]}>
      <Ionicons name={icon} size={18} color={color} style={{ marginBottom: 4 }} />
      <Text style={[sp.val, { color }]}>{value}</Text>
      <Text style={sp.lbl}>{label}</Text>
    </View>
  );
}
const sp = StyleSheet.create({
  pill: { flex: 1, alignItems: 'center', backgroundColor: '#111', borderRadius: 16, paddingVertical: 14, borderWidth: 1 },
  val:  { fontWeight: '900', fontSize: 22, marginBottom: 2 },
  lbl:  { color: '#6b7280', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
});

export default function ProfileTab({ token, userData, refreshData }) {
  const [profile,       setProfile]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [apiLog,        setApiLog]        = useState(null);

  // Form alanları
  const [username,      setUsername]      = useState('');
  const [email,         setEmail]         = useState('');
  const [currentPw,     setCurrentPw]     = useState('');
  const [newPw,         setNewPw]         = useState('');
  const [showCurPw,     setShowCurPw]     = useState(false);
  const [showNewPw,     setShowNewPw]     = useState(false);

  const fetchProfile = useCallback(async () => {
    const endpoint = `${API_URL}/api/Profile`;
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'GET' });
    try {
      const res = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data.data;
      setProfile(data);
      setUsername(data.username || '');
      setEmail(data.email || '');
      setApiLog({ status: '200 OK', endpoint, method: 'GET', response: { username: data.username, email: data.email } });
    } catch (err) {
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'GET' });
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const onRefresh = async () => { setRefreshing(true); await fetchProfile(); await refreshData(); setRefreshing(false); };

  const handleSave = async () => {
    if (!username.trim() && !email.trim() && !newPw) {
      Alert.alert('Hata', 'En az bir alan doldurulmalıdır.');
      return;
    }
    if (newPw && !currentPw) {
      Alert.alert('Hata', 'Şifre değiştirmek için mevcut şifrenizi giriniz.');
      return;
    }
    setSaving(true);
    const endpoint = `${API_URL}/api/Profile`;
    const payload = {};
    if (username.trim()) payload.username = username.trim();
    if (email.trim())    payload.email    = email.trim();
    if (newPw)           { payload.currentPassword = currentPw; payload.newPassword = newPw; }
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'PATCH', payload: { ...payload, currentPassword: payload.currentPassword ? '***' : undefined, newPassword: payload.newPassword ? '***' : undefined } });
    try {
      const res = await axios.patch(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data.data;
      setApiLog({ status: '200 OK', endpoint, method: 'PATCH', response: { username: data.username, email: data.email } });
      setProfile(data);
      setCurrentPw(''); setNewPw('');
      Alert.alert('Başarılı', 'Profilin güncellendi!');
      await refreshData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Profil güncellenemedi.';
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'PATCH', response: err.response?.data });
      Alert.alert('Hata', msg);
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <View style={s.loadingBox}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={s.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}>

      {/* AVATAR & UNVAN */}
      <GlowCard glowColor="#f97316" style={{ marginBottom: 14 }}>
        <View style={[s.topBar, { backgroundColor: '#f97316' }]} />
        <View style={s.avatarSection}>
          <LinearGradient colors={['#f97316', '#f59e0b']} style={s.avatarCircle} start={[0,0]} end={[1,1]}>
            <Ionicons name="person" size={46} color="#000" />
          </LinearGradient>
          <Text style={s.profileName}>{profile?.username || userData?.currentTitle || '—'}</Text>
          <Text style={s.profileEmail}>{profile?.email || ''}</Text>
          <View style={s.titleBadge}>
            <Ionicons name="trophy" size={13} color="#f59e0b" />
            <Text style={s.titleBadgeText}>{profile?.title || userData?.currentTitle || 'Acemi Savaşçı'}</Text>
          </View>
        </View>
        <View style={s.statsRow}>
          <StatPill icon="flame"         value={profile?.totalWorkouts ?? userData?.totalWorkouts ?? 0} label="Seans"  color="#f97316" />
          <View style={s.statDivider} />
          <StatPill icon="medal"         value={profile?.badgeCount    ?? userData?.badgeCount    ?? 0} label="Rozet"  color="#a855f7" />
          <View style={s.statDivider} />
          <StatPill icon="calendar"      value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : '—'} label="Üyelik" color="#3b82f6" />
        </View>
      </GlowCard>

      {/* PROFİL DÜZENLE */}
      <GlowCard glowColor="#f59e0b" style={{ marginBottom: 14 }}>
        <View style={[s.topBar, { backgroundColor: '#f59e0b' }]} />
        <View style={s.cardBody}>
          <View style={s.cardTitleRow}>
            <View style={[s.cardIcon, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
              <Ionicons name="create" size={18} color="#f59e0b" />
            </View>
            <Text style={s.cardTitle}>Profili Düzenle</Text>
          </View>

          <Text style={s.fieldLabel}>Kullanıcı Adı</Text>
          <View style={s.inputWrap}>
            <Ionicons name="person-outline" size={18} color="#6b7280" style={{ marginRight: 10 }} />
            <TextInput style={s.input} placeholder={profile?.username || 'Kullanıcı adı'}
              placeholderTextColor="#4b5563" value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>

          <Text style={s.fieldLabel}>E-posta</Text>
          <View style={s.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#6b7280" style={{ marginRight: 10 }} />
            <TextInput style={s.input} placeholder={profile?.email || 'E-posta adresi'}
              placeholderTextColor="#4b5563" value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" />
          </View>

          <LinearGradient colors={['#f97316', '#f59e0b', '#f97316']} style={s.saveGrad} start={[0,0]} end={[1,0]}>
            <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#000" /> :
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="checkmark-circle" size={20} color="#000" />
                  <Text style={s.saveBtnText}>BİLGİLERİ KAYDET</Text>
                </View>
              }
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </GlowCard>

      {/* ŞİFRE DEĞİŞTİR */}
      <GlowCard glowColor="#3b82f6" style={{ marginBottom: 14 }}>
        <View style={[s.topBar, { backgroundColor: '#3b82f6' }]} />
        <View style={s.cardBody}>
          <View style={s.cardTitleRow}>
            <View style={[s.cardIcon, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Ionicons name="lock-closed" size={18} color="#60a5fa" />
            </View>
            <Text style={s.cardTitle}>Şifre Değiştir</Text>
          </View>

          <Text style={s.fieldLabel}>Mevcut Şifre</Text>
          <View style={s.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#6b7280" style={{ marginRight: 10 }} />
            <TextInput style={s.input} placeholder="Mevcut şifre" placeholderTextColor="#4b5563"
              value={currentPw} onChangeText={setCurrentPw} secureTextEntry={!showCurPw} />
            <TouchableOpacity onPress={() => setShowCurPw(v => !v)}>
              <Ionicons name={showCurPw ? 'eye-off-outline' : 'eye-outline'} size={18} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <Text style={s.fieldLabel}>Yeni Şifre</Text>
          <View style={s.inputWrap}>
            <Ionicons name="lock-open-outline" size={18} color="#6b7280" style={{ marginRight: 10 }} />
            <TextInput style={s.input} placeholder="En az 6 karakter" placeholderTextColor="#4b5563"
              value={newPw} onChangeText={setNewPw} secureTextEntry={!showNewPw} />
            <TouchableOpacity onPress={() => setShowNewPw(v => !v)}>
              <Ionicons name={showNewPw ? 'eye-off-outline' : 'eye-outline'} size={18} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <LinearGradient colors={['#3b82f6', '#60a5fa', '#3b82f6']} style={s.saveGrad} start={[0,0]} end={[1,0]}>
            <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#000" /> :
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="shield-checkmark" size={20} color="#000" />
                  <Text style={s.saveBtnText}>ŞİFREYİ GÜNCELLE</Text>
                </View>
              }
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </GlowCard>

      {/* API LOG */}
      {apiLog && (
        <View style={s.logBox}>
          <Text style={s.logTitle}>API ISTEK / YANIT</Text>
          <Text style={s.logRow}><Text style={s.logKey}>Metod: </Text>{apiLog.method}</Text>
          <Text style={s.logRow}><Text style={s.logKey}>Endpoint: </Text>{apiLog.endpoint}</Text>
          {apiLog.payload && <Text style={s.logRow}><Text style={s.logKey}>Istek: </Text>{JSON.stringify(apiLog.payload)}</Text>}
          <Text style={[s.logRow, { color: apiLog.status === '200 OK' ? '#4ade80' : apiLog.status.includes('GÖN') ? '#f59e0b' : '#f87171' }]}>
            <Text style={s.logKey}>Durum: </Text>{apiLog.status}
          </Text>
          {apiLog.response && <Text style={s.logRow}><Text style={s.logKey}>Yanit: </Text>{JSON.stringify(apiLog.response)}</Text>}
        </View>
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:        { flex: 1 },
  loadingBox:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText:   { color: '#6b7280', fontSize: 13, fontWeight: '700' },
  topBar:        { height: 4 },
  avatarSection: { alignItems: 'center', paddingTop: 24, paddingBottom: 20, paddingHorizontal: 20 },
  avatarCircle:  { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: '#f97316', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 18, elevation: 12 },
  profileName:   { color: '#fff', fontWeight: '900', fontSize: 22, letterSpacing: 0.5, marginBottom: 4 },
  profileEmail:  { color: '#6b7280', fontSize: 13, fontWeight: '600', marginBottom: 10 },
  titleBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  titleBadgeText:{ color: '#f59e0b', fontSize: 12, fontWeight: '800' },
  statsRow:      { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  statDivider:   { width: 1, backgroundColor: '#1f2937', alignSelf: 'stretch' },
  cardBody:      { padding: 20 },
  cardTitleRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  cardIcon:      { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle:     { color: '#fff', fontWeight: '900', fontSize: 15, flex: 1, letterSpacing: 0.5 },
  fieldLabel:    { color: '#9ca3af', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  inputWrap:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', borderWidth: 2, borderColor: '#1f2937', borderRadius: 14, paddingHorizontal: 14, marginBottom: 16 },
  input:         { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 14, fontWeight: '600' },
  saveGrad:      { borderRadius: 14, marginTop: 4, shadowColor: '#f97316', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 10 },
  saveBtn:       { paddingVertical: 15, alignItems: 'center' },
  saveBtnText:   { color: '#000', fontWeight: '900', fontSize: 13, letterSpacing: 1.5 },
  logBox:        { backgroundColor: '#080808', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', marginBottom: 10 },
  logTitle:      { color: '#f97316', fontWeight: '900', fontSize: 10, marginBottom: 8, letterSpacing: 3 },
  logRow:        { color: '#6b7280', fontSize: 10, marginBottom: 4, lineHeight: 16 },
  logKey:        { color: '#f59e0b', fontWeight: '700' },
});
