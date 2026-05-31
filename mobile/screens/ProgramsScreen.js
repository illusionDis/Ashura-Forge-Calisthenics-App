import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://ashura-forge-api.onrender.com';

const PROGRAMS = [
  { id:1, category:'Strength',    name:'Başlangıç Güç Programı', difficulty:'Başlangıç', duration:30, barColor:'#f97316', exercises:['Push-up × 3×10','Squat × 3×15','Dip × 3×8','Pike Push-up × 3×6'] },
  { id:2, category:'Strength',    name:'Üst Vücut Patlaması',    difficulty:'Orta',      duration:45, barColor:'#ef4444', exercises:['Pull-up × 4×6','Archer Push-up × 3×8','Dip × 4×10','Negative Muscle-up × 3×5'] },
  { id:3, category:'Strength',    name:'Alt Vücut Dominasyonu',  difficulty:'Orta',      duration:40, barColor:'#f59e0b', exercises:['Pistol Squat × 3×5','Bulgarian Split Squat × 3×10','Jump Squat × 4×12','Nordic Curl × 3×6'] },
  { id:4, category:'Balance',     name:'Çekirdek & Denge Temeli',difficulty:'Başlangıç', duration:30, barColor:'#a855f7', exercises:['Plank × 4×45sn','Hollow Body Hold × 3×30sn','L-Sit × 3×15sn','Dead Bug × 3×10'] },
  { id:5, category:'Balance',     name:'Handstand Yolculuğu',    difficulty:'Orta',      duration:45, barColor:'#7c3aed', exercises:['Frogstand × 4×20sn','Wall Handstand × 4×30sn','Crow Pose × 3×20sn','Headstand × 3×30sn'] },
  { id:6, category:'Balance',     name:'İleri Denge Ustalığı',   difficulty:'İleri',     duration:50, barColor:'#6366f1', exercises:['Dragon Flag × 3×5','Back Lever × 3×10sn','Human Flag × 4×8sn','Straddle L-Sit × 3×15sn'] },
  { id:7, category:'Flexibility', name:'Sabah Aktivasyon',        difficulty:'Başlangıç', duration:20, barColor:'#10b981', exercises:['Hip Flexor × 2×60sn','Hamstring × 2×45sn','Shoulder Dislocate × 3×10','Cat-Cow × 2×10'] },
  { id:8, category:'Flexibility', name:'Derin Esneklik',          difficulty:'Orta',      duration:35, barColor:'#059669', exercises:['Bridge × 3×30sn','Pike Stretch × 3×60sn','Pancake Stretch × 3×45sn','Front Split × 2×60sn'] },
  { id:9, category:'Flexibility', name:'Akış & Mobilite',         difficulty:'Orta',      duration:30, barColor:'#0d9488', exercises:['Sun Salutation × 3 tur','Pigeon Pose × 2×60sn','Cobra × 3×30sn','Thread The Needle × 2×45sn'] },
];

const CATS = ['Tümü','Strength','Balance','Flexibility'];
const DIFF_COLORS = { 'Başlangıç':'#4ade80', 'Orta':'#f59e0b', 'İleri':'#f87171' };

const CAT_ICON = {
  Tümü:        <Ionicons name="bar-chart-outline" size={14} />,
  Strength:    <Ionicons name="shield-outline" size={14} />,
  Balance:     <Ionicons name="star-outline" size={14} />,
  Flexibility: <Ionicons name="leaf-outline" size={14} />,
};

export default function ProgramsScreen({ route, navigation }) {
  const { token } = route.params;
  const [activeCat, setActiveCat] = useState('Tümü');
  const [loadingId, setLoadingId] = useState(null);
  const [doneId,    setDoneId]    = useState(null);
  const [apiLog,    setApiLog]    = useState(null);

  const filtered = activeCat === 'Tümü' ? PROGRAMS : PROGRAMS.filter(p => p.category === activeCat);

  const handleSelect = async (program) => {
    setLoadingId(program.id);
    const endpoint = `${API_URL}/api/Workout`;
    const payload  = { name: program.name, durationMinutes: program.duration, category: program.category };
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'POST', payload });
    try {
      const res = await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      setApiLog({ status: '201 Created', endpoint, method: 'POST', payload, response: { id: res.data.data?.id, name: res.data.data?.name } });
      setDoneId(program.id);
      Alert.alert('Eklendi', `"${program.name}" antrenman geçmişine eklendi.`);
      setTimeout(() => setDoneId(null), 3000);
    } catch (err) {
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'POST', payload });
      Alert.alert('Hata', 'Program eklenemedi.');
    } finally { setLoadingId(null); }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#f97316" />
          <Text style={s.backText}>Geri</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Ionicons name="book-outline" size={18} color="#f97316" />
          <Text style={s.headerTitle}>HAZIR PROGRAMLAR</Text>
        </View>
        <View style={{ width: 70 }} />
      </View>

      {/* KATEGORİ */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 10 }}>
        {CATS.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setActiveCat(cat)}>
            {activeCat === cat
              ? <LinearGradient colors={['#f97316','#f59e0b']} style={s.catActive} start={[0,0]} end={[1,0]}>
                  <Text style={s.catActiveText}>{cat}</Text>
                  <Text style={s.catCount}>{cat === 'Tümü' ? PROGRAMS.length : PROGRAMS.filter(p=>p.category===cat).length}</Text>
                </LinearGradient>
              : <View style={s.catBtn}>
                  <Text style={s.catText}>{cat}</Text>
                  <Text style={s.catCountInactive}>{cat === 'Tümü' ? PROGRAMS.length : PROGRAMS.filter(p=>p.category===cat).length}</Text>
                </View>
            }
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}>
        {filtered.map(program => (
          <View key={program.id} style={s.card}>
            <View style={[s.cardBar, { backgroundColor: program.barColor }]} />
            <View style={s.cardBody}>

              {/* Başlık */}
              <View style={s.cardHead}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardName}>{program.name}</Text>
                  <View style={s.cardMeta}>
                    <Text style={[s.diffText, { color: DIFF_COLORS[program.difficulty] }]}>● {program.difficulty}</Text>
                    <View style={s.durBadge}>
                      <Ionicons name="time-outline" size={11} color="#6b7280" />
                      <Text style={s.durText}> {program.duration} dk</Text>
                    </View>
                  </View>
                </View>
                <View style={[s.catBadge, { backgroundColor: program.barColor + '20', borderColor: program.barColor + '40' }]}>
                  <Text style={[s.catBadgeText, { color: program.barColor }]}>{program.category}</Text>
                </View>
              </View>

              {/* Hareketler */}
              <View style={s.exBox}>
                <Text style={s.exBoxTitle}>HAREKETLER</Text>
                {program.exercises.map((ex, i) => (
                  <View key={i} style={s.exRow}>
                    <View style={[s.exNum, { backgroundColor: program.barColor }]}>
                      <Text style={s.exNumText}>{i + 1}</Text>
                    </View>
                    <Text style={s.exText}>{ex}</Text>
                  </View>
                ))}
              </View>

              {/* Seç Butonu */}
              {doneId === program.id
                ? <LinearGradient colors={['#16a34a','#15803d']} style={s.selGrad}>
                    <View style={s.selBtn}>
                      <Ionicons name="checkmark" size={18} color="#fff" />
                      <Text style={s.selText}>Eklendi!</Text>
                    </View>
                  </LinearGradient>
                : <LinearGradient colors={[program.barColor, program.barColor + 'cc']} style={s.selGrad} start={[0,0]} end={[1,0]}>
                    <TouchableOpacity style={s.selBtn} onPress={() => handleSelect(program)} disabled={loadingId === program.id}>
                      {loadingId === program.id ? <ActivityIndicator color="#fff" size="small" /> :
                        <>
                          <Ionicons name="flash" size={18} color="#fff" />
                          <Text style={s.selText}>Programı Seç</Text>
                        </>
                      }
                    </TouchableOpacity>
                  </LinearGradient>
              }
            </View>
          </View>
        ))}

        {/* API LOG */}
        {apiLog && (
          <View style={s.logBox}>
            <Text style={s.logTitle}>API ISTEK / YANIT</Text>
            <Text style={s.logRow}><Text style={s.logKey}>Metod: </Text>{apiLog.method}</Text>
            <Text style={s.logRow}><Text style={s.logKey}>Endpoint: </Text>{apiLog.endpoint}</Text>
            {apiLog.payload && <Text style={s.logRow}><Text style={s.logKey}>Istek: </Text>{JSON.stringify(apiLog.payload)}</Text>}
            <Text style={[s.logRow, { color: (apiLog.status === '201 Created') ? '#4ade80' : apiLog.status.includes('GÖN') ? '#f59e0b' : '#f87171' }]}>
              <Text style={s.logKey}>Durum: </Text>{apiLog.status}
            </Text>
            {apiLog.response && <Text style={s.logRow}><Text style={s.logKey}>Yanit: </Text>{JSON.stringify(apiLog.response)}</Text>}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#000' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(249,115,22,0.2)' },
  backBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6 },
  backText:        { color: '#f97316', fontWeight: '800', fontSize: 15 },
  headerCenter:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle:     { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  catScroll:       { maxHeight: 58 },
  catActive:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22 },
  catActiveText:   { color: '#000', fontWeight: '900', fontSize: 13 },
  catCount:        { color: 'rgba(0,0,0,0.5)', fontWeight: '900', fontSize: 11 },
  catBtn:          { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22, backgroundColor: '#111', borderWidth: 1.5, borderColor: '#1f2937' },
  catText:         { color: '#6b7280', fontWeight: '700', fontSize: 13 },
  catCountInactive:{ color: '#374151', fontWeight: '700', fontSize: 11 },
  scroll:          { flex: 1 },
  card:            { backgroundColor: '#0d0d0d', borderRadius: 24, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1f2937' },
  cardBar:         { height: 4 },
  cardBody:        { padding: 18 },
  cardHead:        { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 10 },
  cardName:        { color: '#fff', fontWeight: '900', fontSize: 16, lineHeight: 22, flex: 1 },
  cardMeta:        { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 },
  diffText:        { fontSize: 12, fontWeight: '700' },
  durBadge:        { flexDirection: 'row', alignItems: 'center' },
  durText:         { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  catBadge:        { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  catBadgeText:    { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  exBox:           { backgroundColor: '#000', borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#111' },
  exBoxTitle:      { color: '#374151', fontSize: 9, fontWeight: '900', letterSpacing: 3, marginBottom: 10 },
  exRow:           { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  exNum:           { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exNumText:       { color: '#000', fontWeight: '900', fontSize: 11 },
  exText:          { color: '#d1d5db', fontSize: 13, fontWeight: '500', flex: 1 },
  selGrad:         { borderRadius: 14 },
  selBtn:          { paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  selText:         { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  logBox:          { backgroundColor: '#080808', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', marginBottom: 14 },
  logTitle:        { color: '#f97316', fontWeight: '900', fontSize: 11, marginBottom: 10, letterSpacing: 3 },
  logRow:          { color: '#6b7280', fontSize: 11, marginBottom: 5, lineHeight: 17 },
  logKey:          { color: '#f59e0b', fontWeight: '700' },
});
