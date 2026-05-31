import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'https://ashura-forge-api.onrender.com';
const CATS = ['Cardio', 'Strength', 'Flexibility', 'Balance'];

// Renkli glow kart bileşeni
function GlowCard({ glowColor = '#f97316', style, children }) {
  return (
    <View style={[{ borderRadius: 24, padding: 2, backgroundColor: glowColor + '22' }, style]}>
      <View style={{ backgroundColor: '#0d0d0d', borderRadius: 22, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

export default function ArenaTab({ token, userData, refreshData }) {
  const [refreshing,      setRefreshing]      = useState(false);
  const [apiLog,          setApiLog]          = useState(null);
  const [workoutName,     setWorkoutName]     = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('30');
  const [workoutCategory, setWorkoutCategory] = useState('Cardio');
  const [addingWorkout,   setAddingWorkout]   = useState(false);

  const onRefresh = async () => { setRefreshing(true); await refreshData(); setRefreshing(false); };

  const handleAddWorkout = async () => {
    if (!workoutName.trim()) { Alert.alert('Hata', 'Antrenman adı boş olamaz.'); return; }
    setAddingWorkout(true);
    const endpoint = `${API_URL}/api/Workout`;
    const payload  = { name: workoutName, durationMinutes: parseInt(workoutDuration) || 30, category: workoutCategory };
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'POST', payload });
    try {
      const res = await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      setApiLog({ status: '201 Created', endpoint, method: 'POST', payload, response: { id: res.data.data?.id, name: res.data.data?.name } });
      setWorkoutName(''); setWorkoutDuration('30');
      await refreshData();
    } catch (err) {
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'POST', payload });
      Alert.alert('Hata', 'Antrenman eklenemedi.');
    } finally { setAddingWorkout(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Bu antrenmanı silmek istediğine emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        const endpoint = `${API_URL}/api/Workout/${id}`;
        setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'DELETE' });
        try {
          await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
          setApiLog({ status: '200 OK', endpoint, method: 'DELETE', response: 'Silindi' });
          await refreshData();
        } catch (err) {
          setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'DELETE' });
        }
      }}
    ]);
  };

  const progress = Math.min(
    ((userData?.totalWorkouts || 0) / ((userData?.totalWorkouts || 0) + (userData?.workoutsToNextTitle || 1))) * 100, 100
  );

  return (
    <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}>

      {/* UNVAN KARTI */}
      <GlowCard glowColor="#f97316" style={{ marginBottom: 14 }}>
        <View style={s.titleTopBar} />
        <View style={s.titleBody}>
          <Ionicons name="trophy" size={68} color="#f97316" style={{ marginBottom: 10 }} />
          <Text style={s.titleText}>{userData?.currentTitle || 'Acemi Savaşçı'}</Text>
          <View style={s.nextRow}>
            <Ionicons name="navigate" size={13} color="#f97316" />
            <Text style={s.nextText}> Sonraki Seviye: <Text style={{ color: '#f59e0b' }}>{userData?.nextTitle || 'Belirsiz'}</Text></Text>
          </View>
          <View style={s.progressBg}>
            <LinearGradient colors={['#f97316','#f59e0b']} style={[s.progressFill, { width: `${progress}%` }]} start={[0,0]} end={[1,0]} />
          </View>
          <View style={s.progressLabelRow}>
            <Ionicons name="flame" size={13} color="#f97316" />
            <Text style={s.progressLabel}> {userData?.workoutsToNextTitle || 0} antrenman kaldı!</Text>
          </View>
        </View>
      </GlowCard>

      {/* STAT KARTLARI */}
      <View style={s.statsRow}>
        <GlowCard glowColor="#f97316" style={{ flex: 1 }}>
          <View style={s.statCard}>
            <Ionicons name="flame" size={36} color="#f97316" style={{ marginBottom: 6 }} />
            <Text style={s.statVal}>{userData?.totalWorkouts || 0}</Text>
            <Text style={s.statLbl}>TOPLAM SEANS</Text>
          </View>
        </GlowCard>
        <GlowCard glowColor="#3b82f6" style={{ flex: 1 }}>
          <View style={s.statCard}>
            <Ionicons name="time-outline" size={36} color="#60a5fa" style={{ marginBottom: 6 }} />
            <Text style={s.statVal}>{userData?.totalMinutes || 0}</Text>
            <Text style={s.statLbl}>DAKİKA</Text>
          </View>
        </GlowCard>
      </View>

      {/* ROZETLER */}
      {(userData?.earnedBadges || []).length > 0 && (
        <GlowCard glowColor="#a855f7" style={{ marginBottom: 14 }}>
          <View style={[s.topColorBar, { backgroundColor: '#a855f7' }]} />
          <View style={s.cardBody}>
            <View style={s.cardTitleRow}>
              <View style={[s.cardIcon, { backgroundColor: 'rgba(168,85,247,0.15)' }]}>
                <Ionicons name="medal" size={20} color="#a855f7" />
              </View>
              <Text style={s.cardTitle}>Başarı Rozetleri</Text>
              <View style={s.badgeCountBox}>
                <Text style={{ color: '#a855f7', fontWeight: '900', fontSize: 11 }}>{userData.badgeCount} Rozet</Text>
              </View>
            </View>
            <View style={s.badgesGrid}>
              {userData.earnedBadges.map((badge, i) => (
                <View key={i} style={s.badgeItem}>
                  <Text style={s.badgeIcon}>{badge.icon || '★'}</Text>
                  <Text style={s.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </GlowCard>
      )}

      {/* ANTRENMAN EKLE */}
      <GlowCard glowColor="#f59e0b" style={{ marginBottom: 14 }}>
        <View style={[s.topColorBar, { backgroundColor: '#f97316' }]} />
        <View style={s.cardBody}>
          <View style={s.cardTitleRow}>
            <View style={[s.cardIcon, { backgroundColor: 'rgba(249,115,22,0.15)' }]}>
              <Ionicons name="add" size={20} color="#f97316" />
            </View>
            <Text style={s.cardTitle}>Yeni Antrenman</Text>
          </View>
          <TextInput style={s.input} placeholder="Antrenman Adı (örn: Bench Press, Squat)"
            placeholderTextColor="#4b5563" value={workoutName} onChangeText={setWorkoutName} />
          <TextInput style={s.input} placeholder="Dakika"
            placeholderTextColor="#4b5563" value={workoutDuration}
            onChangeText={setWorkoutDuration} keyboardType="numeric" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {CATS.map(cat => (
              <TouchableOpacity key={cat} style={[s.catBtn, workoutCategory === cat && s.catBtnActive]}
                onPress={() => setWorkoutCategory(cat)}>
                <Text style={[s.catText, workoutCategory === cat && s.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <LinearGradient colors={['#f97316','#f59e0b','#f97316']} style={s.addBtnGrad} start={[0,0]} end={[1,0]}>
            <TouchableOpacity style={s.addBtn} onPress={handleAddWorkout} disabled={addingWorkout}>
              {addingWorkout ? <ActivityIndicator color="#000" /> :
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="flash" size={20} color="#000" />
                  <Text style={s.addBtnText}>ANTRENMANI KAYDET</Text>
                </View>
              }
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </GlowCard>

      {/* GEÇMİŞ */}
      <GlowCard glowColor="#06b6d4" style={{ marginBottom: 14 }}>
        <View style={[s.topColorBar, { backgroundColor: '#06b6d4' }]} />
        <View style={s.cardBody}>
          <View style={s.cardTitleRow}>
            <View style={[s.cardIcon, { backgroundColor: 'rgba(6,182,212,0.15)' }]}>
              <Ionicons name="pulse" size={20} color="#06b6d4" />
            </View>
            <Text style={s.cardTitle}>Antrenman Geçmişi</Text>
          </View>
          {(userData?.recentWorkouts || []).length === 0
            ? <View style={s.emptyBox}>
                <Ionicons name="pulse" size={56} color="#1f2937" />
                <Text style={s.emptyText}>Henüz antrenman kaydın yok!</Text>
                <Text style={s.emptySubText}>İlk antrenmanını ekle ve yolculuğa başla.</Text>
              </View>
            : userData.recentWorkouts.map(w => (
              <View key={w.id} style={s.workoutRow}>
                <View style={s.workoutIconBox}>
                  <MaterialCommunityIcons name="dumbbell" size={24} color="#f97316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.workoutName}>{w.name}</Text>
                  <Text style={s.workoutMeta}>{w.category} • {new Date(w.workoutDate).toLocaleDateString('tr-TR')}</Text>
                </View>
                <View style={s.workoutRight}>
                  <View>
                    <Text style={s.workoutDur}>{w.durationMinutes}</Text>
                    <Text style={s.workoutDurLbl}>DAKİKA</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(w.id)} style={s.delBtn}>
                    <Ionicons name="trash-outline" size={18} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        </View>
      </GlowCard>

      {/* API LOG */}
      {apiLog && (
        <View style={s.logBox}>
          <Text style={s.logTitle}>API ISTEK / YANIT</Text>
          <Text style={s.logRow}><Text style={s.logKey}>Metod: </Text>{apiLog.method}</Text>
          <Text style={s.logRow}><Text style={s.logKey}>Endpoint: </Text>{apiLog.endpoint}</Text>
          {apiLog.payload && <Text style={s.logRow}><Text style={s.logKey}>Istek: </Text>{JSON.stringify(apiLog.payload)}</Text>}
          <Text style={[s.logRow, { color: ['200 OK','201 Created'].includes(apiLog.status) ? '#4ade80' : apiLog.status.includes('GÖN') ? '#f59e0b' : '#f87171' }]}>
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
  scroll:          { flex: 1 },
  titleTopBar:     { height: 4, backgroundColor: '#f97316' },
  titleBody:       { padding: 26, alignItems: 'center' },
  titleText:       { fontSize: 24, fontWeight: '900', color: '#f59e0b', textAlign: 'center', letterSpacing: 1, marginBottom: 8 },
  nextRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  nextText:        { color: '#9ca3af', fontSize: 13, fontWeight: '600' },
  progressBg:      { width: '100%', height: 10, backgroundColor: '#1f2937', borderRadius: 10, overflow: 'hidden', marginBottom: 8 },
  progressFill:    { height: 10, borderRadius: 10 },
  progressLabelRow:{ flexDirection: 'row', alignItems: 'center' },
  progressLabel:   { color: '#f97316', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  statsRow:        { flexDirection: 'row', gap: 12, marginBottom: 14 },
  statCard:        { padding: 18, alignItems: 'center' },
  statVal:         { color: '#fff', fontWeight: '900', fontSize: 30, marginBottom: 4 },
  statLbl:         { color: '#6b7280', fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  topColorBar:     { height: 4 },
  cardBody:        { padding: 20 },
  cardTitleRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  cardIcon:        { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle:       { color: '#fff', fontWeight: '900', fontSize: 15, flex: 1, letterSpacing: 0.5 },
  badgeCountBox:   { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(168,85,247,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  badgesGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeItem:       { backgroundColor: '#111', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)', minWidth: 76 },
  badgeIcon:       { fontSize: 28, color: '#f59e0b', marginBottom: 4, textAlign: 'center' },
  badgeName:       { color: '#d1d5db', fontWeight: '700', fontSize: 9, textAlign: 'center' },
  input:           { backgroundColor: '#000', borderWidth: 2, borderColor: '#1f2937', borderRadius: 14, padding: 14, color: '#fff', fontSize: 14, marginBottom: 12, fontWeight: '600' },
  catBtn:          { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#000', borderWidth: 1.5, borderColor: '#1f2937', marginRight: 8 },
  catBtnActive:    { backgroundColor: '#f97316', borderColor: '#f97316' },
  catText:         { color: '#6b7280', fontWeight: '700', fontSize: 12 },
  catTextActive:   { color: '#000', fontWeight: '900' },
  addBtnGrad:      { borderRadius: 14, shadowColor: '#f97316', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 10 },
  addBtn:          { paddingVertical: 16, alignItems: 'center' },
  addBtnText:      { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1.5 },
  workoutRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111' },
  workoutIconBox:  { width: 50, height: 50, backgroundColor: 'rgba(249,115,22,0.08)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)' },
  workoutName:     { color: '#fff', fontWeight: '800', fontSize: 14 },
  workoutMeta:     { color: '#6b7280', fontSize: 10, marginTop: 3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  workoutRight:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workoutDur:      { color: '#f97316', fontWeight: '900', fontSize: 24, textAlign: 'right' },
  workoutDurLbl:   { color: '#6b7280', fontSize: 8, fontWeight: '900', letterSpacing: 1, textAlign: 'right' },
  delBtn:          { padding: 8 },
  emptyBox:        { alignItems: 'center', paddingVertical: 32 },
  emptyText:       { color: '#4b5563', fontWeight: '900', fontSize: 12, marginTop: 10, textTransform: 'uppercase', letterSpacing: 2 },
  emptySubText:    { color: '#374151', fontSize: 11, marginTop: 6 },
  logBox:          { backgroundColor: '#080808', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', marginBottom: 10 },
  logTitle:        { color: '#f97316', fontWeight: '900', fontSize: 10, marginBottom: 8, letterSpacing: 3 },
  logRow:          { color: '#6b7280', fontSize: 10, marginBottom: 4, lineHeight: 16 },
  logKey:          { color: '#f59e0b', fontWeight: '700' },
});
