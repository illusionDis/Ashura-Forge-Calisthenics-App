import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_URL = 'https://ashura-forge-api.onrender.com';

export default function ProgramDetailScreen({ route, navigation }) {
  const { program, token } = route.params;

  const [checked,   setChecked]   = useState(new Array(program.exercises.length).fill(false));
  const [saving,    setSaving]    = useState(false);
  const [apiLog,    setApiLog]    = useState(null);
  const [completed, setCompleted] = useState(false);

  const doneCount    = checked.filter(Boolean).length;
  const totalCount   = program.exercises.length;
  const progressPct  = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const allDone      = doneCount === totalCount;

  const toggleExercise = (idx) => {
    if (completed) return;
    setChecked(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleComplete = async () => {
    if (doneCount === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir egzersizi tamamla.');
      return;
    }
    setSaving(true);
    const endpoint = `${API_URL}/api/Workout`;
    const payload  = {
      name: program.name,
      durationMinutes: program.duration,
      category: program.category,
    };
    setApiLog({ status: 'GÖNDERİLİYOR...', endpoint, method: 'POST', payload });
    try {
      const res = await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      setApiLog({
        status: '201 Created', endpoint, method: 'POST', payload,
        response: { id: res.data.data?.id, name: res.data.data?.name },
      });
      setCompleted(true);
    } catch (err) {
      setApiLog({ status: `${err.response?.status || 'Hata'}`, endpoint, method: 'POST', payload, response: err.response?.data });
      Alert.alert('Hata', 'Antrenman kaydedilemedi. Tekrar dene.');
    } finally { setSaving(false); }
  };

  const DIFF_COLORS = { 'Başlangıç': '#4ade80', 'Orta': '#f59e0b', 'İleri': '#f87171' };

  return (
    <SafeAreaView style={s.safe}>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#f97316" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle} numberOfLines={1}>{program.name}</Text>
          <Text style={s.headerSub}>{program.category} • {program.duration} dk</Text>
        </View>
        <View style={[s.diffBadge, { backgroundColor: (DIFF_COLORS[program.difficulty] || '#6b7280') + '20', borderColor: (DIFF_COLORS[program.difficulty] || '#6b7280') + '50' }]}>
          <Text style={[s.diffText, { color: DIFF_COLORS[program.difficulty] || '#6b7280' }]}>{program.difficulty}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* İLERLEME KARTI */}
        <View style={[s.progressCard, { borderColor: program.barColor + '40' }]}>
          <View style={s.progressCardTop}>
            <Ionicons name="flash" size={18} color={program.barColor} />
            <Text style={s.progressTitle}>İlerleme</Text>
            <Text style={[s.progressCount, { color: program.barColor }]}>{doneCount}/{totalCount}</Text>
          </View>
          <View style={s.progressBg}>
            <LinearGradient
              colors={[program.barColor, program.barColor + 'bb']}
              style={[s.progressFill, { width: `${progressPct}%` }]}
              start={[0,0]} end={[1,0]}
            />
          </View>
          {allDone && !completed && (
            <View style={s.allDoneRow}>
              <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
              <Text style={s.allDoneText}> Tüm egzersizleri tamamladın! Antrenmanı kaydetmeye hazırsın.</Text>
            </View>
          )}
        </View>

        {/* EGZERSİZ LİSTESİ */}
        <Text style={s.sectionLabel}>EGZERSİZLER</Text>
        <View style={s.exerciseList}>
          {program.exercises.map((ex, i) => (
            <TouchableOpacity
              key={i}
              style={[s.exRow, checked[i] && { backgroundColor: program.barColor + '12', borderColor: program.barColor + '35' }]}
              onPress={() => toggleExercise(i)}
              activeOpacity={0.75}
            >
              {/* Numara / checkmark */}
              <View style={[s.exCircle, { backgroundColor: checked[i] ? program.barColor : '#111', borderColor: checked[i] ? program.barColor : '#1f2937' }]}>
                {checked[i]
                  ? <Ionicons name="checkmark" size={14} color="#000" />
                  : <Text style={[s.exNum, { color: program.barColor }]}>{i + 1}</Text>
                }
              </View>

              {/* İsim */}
              <Text style={[s.exName, checked[i] && { color: '#6b7280', textDecorationLine: 'line-through' }]}>{ex}</Text>

              {/* Sağ ikon */}
              {checked[i]
                ? <Ionicons name="checkmark-circle" size={20} color={program.barColor} />
                : <View style={[s.tapHint, { borderColor: program.barColor + '40' }]}>
                    <Text style={[s.tapHintText, { color: program.barColor }]}>TAP</Text>
                  </View>
              }
            </TouchableOpacity>
          ))}
        </View>

        {/* TAMAMLA BUTONU */}
        {!completed ? (
          <LinearGradient
            colors={doneCount > 0 ? [program.barColor, program.barColor + 'cc'] : ['#1f2937', '#111827']}
            style={s.completeGrad} start={[0,0]} end={[1,0]}
          >
            <TouchableOpacity style={s.completeBtn} onPress={handleComplete} disabled={saving || doneCount === 0}>
              {saving
                ? <ActivityIndicator color="#000" />
                : <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <MaterialCommunityIcons name="dumbbell" size={22} color={doneCount > 0 ? '#000' : '#374151'} />
                    <Text style={[s.completeBtnText, { color: doneCount > 0 ? '#000' : '#374151' }]}>
                      {allDone ? 'ANTRENMANI TAMAMLA' : `${doneCount} EGZERSİZ İLE TAMAMLA`}
                    </Text>
                  </View>
              }
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          /* BAŞARI DURUMU */
          <View style={s.successCard}>
            <LinearGradient colors={['#052e16', '#14532d']} style={s.successGrad} start={[0,0]} end={[1,1]}>
              <Ionicons name="trophy" size={52} color="#4ade80" style={{ marginBottom: 12 }} />
              <Text style={s.successTitle}>Antrenman Kaydedildi!</Text>
              <Text style={s.successSub}>{program.name} antrenmanın geçmişine eklendi.</Text>
              <View style={s.successStats}>
                <View style={s.successStat}>
                  <Ionicons name="flash" size={16} color="#4ade80" />
                  <Text style={s.successStatText}>{doneCount}/{totalCount} egzersiz</Text>
                </View>
                <View style={s.successStat}>
                  <Ionicons name="time-outline" size={16} color="#4ade80" />
                  <Text style={s.successStatText}>{program.duration} dakika</Text>
                </View>
              </View>
              <TouchableOpacity style={s.backHomeBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="home" size={16} color="#4ade80" />
                <Text style={s.backHomeBtnText}>Ana Sayfaya Dön</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* API LOG */}
        {apiLog && (
          <View style={s.logBox}>
            <Text style={s.logTitle}>API ISTEK / YANIT</Text>
            <Text style={s.logRow}><Text style={s.logKey}>Metod: </Text>{apiLog.method}</Text>
            <Text style={s.logRow}><Text style={s.logKey}>Endpoint: </Text>{apiLog.endpoint}</Text>
            {apiLog.payload && <Text style={s.logRow}><Text style={s.logKey}>Istek: </Text>{JSON.stringify(apiLog.payload)}</Text>}
            <Text style={[s.logRow, { color: ['201 Created', '200 OK'].includes(apiLog.status) ? '#4ade80' : apiLog.status.includes('GÖN') ? '#f59e0b' : '#f87171' }]}>
              <Text style={s.logKey}>Durum: </Text>{apiLog.status}
            </Text>
            {apiLog.response && <Text style={s.logRow}><Text style={s.logKey}>Yanit: </Text>{JSON.stringify(apiLog.response)}</Text>}
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#000' },
  header:           { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(249,115,22,0.2)' },
  backBtn:          { width: 42, height: 42, backgroundColor: '#0d0d0d', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1f2937' },
  headerTitle:      { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.3 },
  headerSub:        { color: '#6b7280', fontSize: 11, marginTop: 2, fontWeight: '600' },
  diffBadge:        { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  diffText:         { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  progressCard:     { backgroundColor: '#0d0d0d', borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1 },
  progressCardTop:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressTitle:    { color: '#e5e7eb', fontWeight: '800', fontSize: 13, flex: 1 },
  progressCount:    { fontWeight: '900', fontSize: 20 },
  progressBg:       { width: '100%', height: 8, backgroundColor: '#1f2937', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  progressFill:     { height: 8, borderRadius: 8 },
  allDoneRow:       { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  allDoneText:      { color: '#4ade80', fontSize: 11, fontWeight: '700', flex: 1, lineHeight: 16 },
  sectionLabel:     { color: '#4b5563', fontSize: 10, fontWeight: '900', letterSpacing: 2.5, marginBottom: 10 },
  exerciseList:     { gap: 8, marginBottom: 20 },
  exRow:            { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0d0d0d', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#111' },
  exCircle:         { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  exNum:            { fontWeight: '900', fontSize: 12 },
  exName:           { flex: 1, color: '#e5e7eb', fontSize: 13, fontWeight: '700' },
  tapHint:          { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  tapHintText:      { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  completeGrad:     { borderRadius: 16, marginBottom: 16, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 10 },
  completeBtn:      { paddingVertical: 17, alignItems: 'center' },
  completeBtnText:  { fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  successCard:      { borderRadius: 22, overflow: 'hidden', marginBottom: 16 },
  successGrad:      { padding: 28, alignItems: 'center', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(74,222,128,0.2)' },
  successTitle:     { color: '#4ade80', fontWeight: '900', fontSize: 22, marginBottom: 8, letterSpacing: 0.5 },
  successSub:       { color: '#86efac', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 18 },
  successStats:     { flexDirection: 'row', gap: 20, marginBottom: 22 },
  successStat:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  successStatText:  { color: '#4ade80', fontSize: 13, fontWeight: '700' },
  backHomeBtn:      { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 22, paddingVertical: 12, backgroundColor: 'rgba(74,222,128,0.15)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  backHomeBtnText:  { color: '#4ade80', fontWeight: '900', fontSize: 13 },
  logBox:           { backgroundColor: '#080808', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', marginBottom: 10 },
  logTitle:         { color: '#f97316', fontWeight: '900', fontSize: 10, marginBottom: 8, letterSpacing: 3 },
  logRow:           { color: '#6b7280', fontSize: 10, marginBottom: 4, lineHeight: 16 },
  logKey:           { color: '#f59e0b', fontWeight: '700' },
});
