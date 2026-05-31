import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const PROGRAMS = [
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
const DIFF_COLORS = { 'Başlangıç':'#4ade80','Orta':'#f59e0b','İleri':'#f87171' };

export default function ProgramsTab({ token, navigation }) {
  const [activeCat, setActiveCat] = useState('Tümü');
  const filtered = activeCat === 'Tümü' ? PROGRAMS : PROGRAMS.filter(p => p.category === activeCat);

  return (
    <View style={{ flex: 1 }}>
      {/* Kategori filtresi */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 10 }}>
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

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filtered.map(program => (
          <View key={program.id} style={[s.card, { borderLeftColor: program.barColor, borderLeftWidth: 3 }]}>
            <View style={[s.cardBar, { backgroundColor: program.barColor }]} />
            <View style={s.cardBody}>
              <View style={s.cardHead}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardName}>{program.name}</Text>
                  <View style={s.cardMeta}>
                    <Text style={[s.diffText, { color: DIFF_COLORS[program.difficulty] }]}>● {program.difficulty}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="time-outline" size={11} color="#6b7280" />
                      <Text style={s.durText}> {program.duration} dk</Text>
                    </View>
                    <View style={[s.catBadge, { backgroundColor: program.barColor + '20', borderColor: program.barColor + '40' }]}>
                      <Text style={[s.catBadgeText, { color: program.barColor }]}>{program.category}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Egzersizler özet */}
              <View style={s.exPreview}>
                {program.exercises.slice(0, 2).map((ex, i) => (
                  <View key={i} style={s.exRow}>
                    <View style={[s.exNum, { backgroundColor: program.barColor }]}>
                      <Text style={s.exNumText}>{i + 1}</Text>
                    </View>
                    <Text style={s.exText}>{ex}</Text>
                  </View>
                ))}
                {program.exercises.length > 2 && (
                  <Text style={[s.moreText, { color: program.barColor }]}>
                    +{program.exercises.length - 2} egzersiz daha...
                  </Text>
                )}
              </View>

              {/* BAŞLA butonu */}
              <LinearGradient colors={[program.barColor, program.barColor + 'bb']} style={s.startGrad} start={[0,0]} end={[1,0]}>
                <TouchableOpacity style={s.startBtn}
                  onPress={() => navigation.navigate('ProgramDetail', { program, token })}>
                  <Ionicons name="play" size={18} color="#fff" />
                  <Text style={s.startText}>Programı Başlat</Text>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  catScroll:       { maxHeight: 58, backgroundColor: '#000' },
  catActive:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  catActiveText:   { color: '#000', fontWeight: '900', fontSize: 12 },
  catCount:        { color: 'rgba(0,0,0,0.5)', fontWeight: '900', fontSize: 10 },
  catBtn:          { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: '#111', borderWidth: 1, borderColor: '#1f2937' },
  catText:         { color: '#6b7280', fontWeight: '700', fontSize: 12 },
  catCountInactive:{ color: '#374151', fontSize: 10, fontWeight: '700' },
  card:            { backgroundColor: '#0d0d0d', borderRadius: 22, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1f2937' },
  cardBar:         { height: 3 },
  cardBody:        { padding: 16 },
  cardHead:        { marginBottom: 12 },
  cardName:        { color: '#fff', fontWeight: '900', fontSize: 16, marginBottom: 8 },
  cardMeta:        { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  diffText:        { fontSize: 12, fontWeight: '700' },
  durText:         { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  catBadge:        { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  catBadgeText:    { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  exPreview:       { backgroundColor: '#000', borderRadius: 14, padding: 12, marginBottom: 12 },
  exRow:           { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  exNum:           { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  exNumText:       { color: '#000', fontWeight: '900', fontSize: 10 },
  exText:          { color: '#9ca3af', fontSize: 12, fontWeight: '500' },
  moreText:        { fontSize: 11, fontWeight: '700', marginTop: 4, letterSpacing: 0.5 },
  startGrad:       { borderRadius: 13 },
  startBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13 },
  startText:       { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5, flex: 1, textAlign: 'center' },
});
