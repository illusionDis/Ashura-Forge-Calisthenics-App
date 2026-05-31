import { useState, useEffect } from 'react';
import { Mail, Lock, User, Dumbbell, ArrowRight, LogOut, Trophy, Activity, Plus, Medal, Flame, Trash2, Bell, Settings, Image as ImageIcon, Home, Upload, Target, TrendingUp, Zap, Award, Calendar, Clock, Star, ChevronRight, X, Check, BookOpen, Shield, Feather, BarChart2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://ashura-forge-api.onrender.com';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profilePic');
    setToken(null);
  };

  return token ? (
    <MainApp token={token} onLogout={handleLogout} />
  ) : (
    <AuthScreen setToken={setToken} />
  );
}

function MainApp({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalProfilePic, setGlobalProfilePic] = useState(localStorage.getItem('profilePic'));

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.data);
      if(res.data.data?.profileImageUrl && !localStorage.getItem('profilePic')) {
        setGlobalProfilePic(res.data.data.profileImageUrl);
        localStorage.setItem('profilePic', res.data.data.profileImageUrl);
      }
    } catch (err) {
      console.error("Veri çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <Dumbbell className="relative w-20 h-20 text-amber-500 animate-bounce" />
        </div>
        <div className="mt-8 flex gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
        <p className="mt-6 text-amber-500 font-black text-lg uppercase tracking-widest animate-pulse">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      
      {/* STICKY HEADER - PROFİL FOTOĞRAFI HER ZAMAN GÖRÜNÜR */}
      <div className="sticky top-0 z-50 backdrop-blur-2xl bg-black/95 border-b border-orange-500/30 shadow-[0_10px_60px_-15px_rgba(249,115,22,0.5)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* SOL: PROFİL FOTOĞRAFI + LOGO + UNVAN */}
            <div className="flex items-center gap-4">
              {/* PROFİL FOTOĞRAFI - HER ZAMAN BURADA */}
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-2xl blur-md group-hover:blur-lg opacity-75 group-hover:opacity-100 transition-all animate-pulse"></div>
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform">
                  {globalProfilePic ? (
                    <img 
                      src={globalProfilePic} 
                      alt="Savaşçı" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900/20 to-red-900/20">
                      <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 border-4 border-black rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 tracking-tighter uppercase">
                    ASHURA FORGE
                  </h1>
                  <div className="flex gap-1">
                    <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                    <Zap className="w-5 h-5 text-amber-500 animate-pulse" style={{animationDelay: '0.5s'}} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-wider">
                    {userData?.currentTitle || "Yeni Savaşçı"}
                  </p>
                </div>
              </div>
            </div>

            {/* ORTA: NAVİGASYON BUTONLARI */}
            <div className="hidden md:flex items-center gap-2 bg-gray-900/50 backdrop-blur-xl p-2 rounded-2xl border border-gray-800/50 shadow-2xl">
              <NavButton 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')}
                icon={<Home className="w-5 h-5" />}
                label="ARENA"
              />
              <NavButton 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')}
                icon={<Settings className="w-5 h-5" />}
                label="PROFİL"
              />
              <NavButton
                active={activeTab === 'programs'}
                onClick={() => setActiveTab('programs')}
                icon={<BookOpen className="w-5 h-5" />}
                label="PROGRAMLAR"
              />
              <NavButton
                active={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
                icon={<Bell className="w-5 h-5" />}
                label="BİLDİRİMLER"
                badge={userData?.badgeCount}
              />
            </div>

            {/* SAĞ: ÇIKIŞ BUTONU */}
            <button 
              onClick={onLogout} 
              className="group p-4 bg-gradient-to-br from-gray-900 to-gray-950 hover:from-red-950 hover:to-red-900 text-gray-400 hover:text-red-400 rounded-xl transition-all duration-300 border border-gray-800 hover:border-red-500/50 shadow-lg hover:shadow-red-500/20">
              <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* MOBİL NAVİGASYON */}
          <div className="md:hidden flex items-center gap-2 mt-4 bg-gray-900/80 backdrop-blur-xl p-2 rounded-2xl border border-gray-800/50">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/50' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              <Home className="w-4 h-4" /> Arena
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${
                activeTab === 'profile' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/50' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              <Settings className="w-4 h-4" /> Profil
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${
                activeTab === 'programs'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/50'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              <BookOpen className="w-4 h-4" /> Prog
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-black text-xs uppercase tracking-wider relative ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/50'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              <Bell className="w-4 h-4" />
              {userData?.badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {userData.badgeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab token={token} userData={userData} refreshData={fetchUserData} />}
        {activeTab === 'programs' && <ProgramsTab token={token} refreshData={fetchUserData} />}
        {activeTab === 'profile' && <ProfileTab token={token} userData={userData} refreshData={fetchUserData} globalProfilePic={globalProfilePic} setGlobalProfilePic={setGlobalProfilePic} />}
        {activeTab === 'notifications' && <NotificationsTab token={token} />}
      </div>

      {/* ARKA PLAN EFEKTLERİ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
}

// NAVİGASYON BUTON KOMPONENTİ
function NavButton({ active, onClick, icon, label, badge }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-black text-sm uppercase tracking-wider ${
        active 
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-2xl shadow-orange-500/50 scale-105' 
          : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
      }`}>
      {icon}
      <span className="hidden lg:inline">{label}</span>
      {badge > 0 && !active && (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black rounded-full flex items-center justify-center animate-pulse shadow-lg">
          {badge}
        </span>
      )}
    </button>
  );
}

function DashboardTab({ token, userData, refreshData }) {
  const [workoutForm, setWorkoutForm] = useState({ name: '', durationMinutes: 30, category: 'Cardio' });

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/Workout`, workoutForm, { headers: { Authorization: `Bearer ${token}` } });
      setWorkoutForm({ name: '', durationMinutes: 30, category: 'Cardio' });
      refreshData();
    } catch (err) { 
      alert("Antrenman eklenirken hata oluştu!"); 
    }
  };

  const handleDeleteWorkout = async (id) => {
    if(!window.confirm("⚠️ Bu antrenmani silmek istediğinden emin misin?")) return;
    try {
      await axios.delete(`${API_URL}/api/Workout/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      refreshData();
    } catch (err) { 
      alert("Silme işlemi başarısız!"); 
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      
      {/* SOL PANEL - UNVAN & İSTATİSTİKLER & FORM */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* UNVAN KARTI */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-gray-900 via-orange-950/20 to-gray-900 border-2 border-orange-500/40 p-8 rounded-3xl text-center shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"></div>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-block p-4 bg-orange-500/10 rounded-full mb-4">
                <Trophy className="w-20 h-20 text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 uppercase tracking-tight mb-3">
                {userData?.currentTitle || "Acemi Savaşçı"}
              </h2>
              <div className="flex items-center justify-center gap-2 text-base text-gray-300 mb-6">
                <Target className="w-5 h-5 text-orange-500" />
                <span className="font-bold">Sonraki Seviye: <span className="text-amber-500">{userData?.nextTitle || "Belirsiz"}</span></span>
              </div>
              
              {/* İLERLEME ÇUBUĞU */}
              <div className="relative">
                <div className="bg-gray-800/80 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-gray-700 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-full transition-all duration-1000 shadow-lg shadow-orange-500/50 relative overflow-hidden"
                    style={{width: `${Math.min(((userData?.totalWorkouts || 0) / ((userData?.totalWorkouts || 0) + (userData?.workoutsToNextTitle || 1))) * 100, 100)}%`}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                  <p className="text-sm font-black text-orange-400 uppercase tracking-wider">
                    {userData?.workoutsToNextTitle || 0} antrenman kaldı!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            icon={<Flame className="w-10 h-10" />}
            value={userData?.totalWorkouts || 0}
            label="Toplam Seans"
            gradient="from-orange-500 to-red-600"
            glowColor="orange"
          />
          <StatCard 
            icon={<Clock className="w-10 h-10" />}
            value={userData?.totalMinutes || 0}
            label="Dakika"
            gradient="from-blue-500 to-cyan-600"
            glowColor="blue"
          />
        </div>

        {/* ANTRENMAN EKLEME FORMU */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all"></div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-6 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/30">
                <Plus className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Yeni Antrenman</h2>
            </div>
            
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <input 
                type="text" 
                placeholder="Antrenman Adı (örn: Bench Press, Squat)" 
                required 
                value={workoutForm.name} 
                onChange={(e) => setWorkoutForm({...workoutForm, name: e.target.value})} 
                className="w-full bg-black/60 border-2 border-gray-800 rounded-xl p-4 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none text-white transition-all placeholder:text-gray-600 font-semibold" 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="Dakika" 
                  required 
                  min="1" 
                  max="999"
                  value={workoutForm.durationMinutes} 
                  onChange={(e) => setWorkoutForm({...workoutForm, durationMinutes: e.target.value})} 
                  className="w-full bg-black/60 border-2 border-gray-800 rounded-xl p-4 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none text-white transition-all font-semibold" 
                />
                <select 
                  value={workoutForm.category} 
                  onChange={(e) => setWorkoutForm({...workoutForm, category: e.target.value})} 
                  className="w-full bg-black/60 border-2 border-gray-800 rounded-xl p-4 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none text-white cursor-pointer font-semibold">
                  <option>Cardio</option>
                  <option>Strength</option>
                  <option>Flexibility</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-black font-black py-4 rounded-xl transition-all shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 active:scale-95 flex items-center justify-center gap-3 group uppercase tracking-wider text-base">
                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Antrenmani Kaydet
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SAĞ PANEL - ROZETLER & GEÇMİŞ */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* ROZET KOMPONENTİ */}
        <BadgesSection badges={userData?.earnedBadges || []} badgeCount={userData?.badgeCount || 0} />

        {/* ANTRENMAN GEÇMİŞİ */}
        <WorkoutHistory workouts={userData?.recentWorkouts || []} onDelete={handleDeleteWorkout} />
      </div>
    </div>
  );
}

// İSTATİSTİK KART KOMPONENTİ
function StatCard({ icon, value, label, gradient, glowColor }) {
  return (
    <div className="relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all`}></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-6 rounded-2xl text-center shadow-xl">
        <div className={`text-${glowColor}-500 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]`}>
          {icon}
        </div>
        <p className="text-5xl font-black text-white mb-2">{value}</p>
        <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest">{label}</p>
      </div>
    </div>
  );
}

// ROZETLER BÖLÜMÜ
function BadgesSection({ badges, badgeCount }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all"></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Başarı Rozetleri</h2>
          </div>
          <div className="px-5 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
            <span className="text-sm font-black text-purple-400">{badgeCount} Rozet</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.length > 0 ? (
            badges.map((badge, idx) => (
              <div key={idx} className="relative group/badge">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-md opacity-50 group-hover/badge:opacity-100 transition-all"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 p-4 rounded-2xl text-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-5xl mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    {badge.icon || "🏆"}
                  </div>
                  <p className="text-sm font-black text-white">{badge.name}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Medal className="w-24 h-24 mx-auto mb-6 text-gray-800 opacity-20" />
              <p className="text-gray-600 font-black uppercase tracking-widest text-sm">Henüz rozet kazanmadın!</p>
              <p className="text-gray-700 text-xs mt-2">Antrenman yap ve rozetleri topla.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ANTRENMAN GEÇMİŞİ KOMPONENTİ
function WorkoutHistory({ workouts, onDelete }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all"></div>
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Antrenman Geçmişi</h2>
        </div>
        
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {workouts.length > 0 ? (
            workouts.map((w) => (
              <div key={w.id} className="group/item relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover/item:from-orange-500/50 group-hover/item:to-amber-500/50 rounded-2xl blur-md transition-all"></div>
                <div className="relative flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 group-hover/item:border-orange-500/50 p-5 rounded-2xl transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 flex items-center justify-center group-hover/item:from-orange-500 group-hover/item:to-amber-500 transition-all shadow-lg">
                      <Dumbbell className="w-7 h-7 text-orange-500 group-hover/item:text-black transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-white text-lg group-hover/item:text-orange-400 transition-colors">{w.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{w.category}</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500 font-semibold">{new Date(w.workoutDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{w.durationMinutes}</p>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Dakika</p>
                    </div>
                    <button 
                      onClick={() => onDelete(w.id)} 
                      className="p-3 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <Activity className="w-24 h-24 mx-auto mb-6 text-gray-800 opacity-20" />
              <p className="text-gray-600 font-black uppercase tracking-widest text-sm">Henüz antrenman kaydın yok!</p>
              <p className="text-gray-700 text-xs mt-2">İlk antrenmanını ekle ve yolculuğa başla.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ token, userData, refreshData, globalProfilePic, setGlobalProfilePic }) {
  const [profileForm, setProfileForm] = useState({ username: '', email: '', currentPassword: '', newPassword: '' });
  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("Dosya boyutu çok büyük! Maksimum 5MB olmalı.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpdate = async (e) => {
    e.preventDefault();
    if(!base64Image) return alert("Lütfen bir fotoğraf seçin.");
    setLoading(true);
    
    try {
      await axios.put(`${API_URL}/api/Profile/image`, 
        { profileImageUrl: 'https://ui-avatars.com/api/?name=Ashura&background=random' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGlobalProfilePic(base64Image);
      localStorage.setItem('profilePic', base64Image);
      
      alert("✅ Fotoğraf başarıyla güncellendi!");
      setBase64Image('');
      refreshData(); 
    } catch (err) { 
      console.error(err.response?.data);
      alert("❌ Fotoğraf güncellenirken hata oluştu."); 
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/api/Profile`, profileForm, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ Profil bilgileri güncellendi!");
      setProfileForm({ username: '', email: '', currentPassword: '', newPassword: '' });
      refreshData();
    } catch (err) { 
      alert("❌ Mevcut şifre hatalı veya bilgiler güncellenemedi."); 
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-700">
      
      {/* FOTOĞRAF YÜKLEME KARTI */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all"></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-50"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-gray-900 to-black rounded-3xl border-2 border-purple-500 overflow-hidden shadow-2xl">
                {base64Image ? (
                  <img src={base64Image} alt="Preview" className="w-full h-full object-cover" />
                ) : globalProfilePic ? (
                  <img src={globalProfilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                    <ImageIcon className="w-12 h-12 text-gray-700" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">Profil Fotoğrafı</h2>
              <p className="text-sm text-gray-500 font-semibold mt-1">Bilgisayarından bir fotoğraf seç</p>
            </div>
          </div>
          
          <form onSubmit={handleImageUpdate} className="space-y-5">
            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer bg-black/40 hover:border-purple-500 hover:bg-purple-900/10 transition-all group/upload overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover/upload:from-purple-500/5 group-hover/upload:to-pink-500/5 transition-all"></div>
              <div className="relative flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-600 group-hover/upload:text-purple-500 mb-3 transition-colors" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-black text-purple-500">Tıklayarak Seç</span> veya sürükle bırak
                </p>
                <p className="text-xs text-gray-600 font-semibold">PNG, JPG (Maks. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            
            <button 
              type="submit" 
              disabled={loading || !base64Image} 
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-base flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  YÜKLENİYOR...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  FOTOĞRAFI GÜNCELLE
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* HESAP AYARLARI KARTI */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all"></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/30">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">Hesap Ayarları</h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Yeni Kullanıcı Adı" 
                value={profileForm.username} 
                onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} 
                className="w-full bg-black/60 border-2 border-gray-800 rounded-xl p-4 text-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none text-white font-semibold placeholder:text-gray-600 transition-all" 
              />
              <input 
                type="email" 
                placeholder="Yeni E-posta" 
                value={profileForm.email} 
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} 
                className="w-full bg-black/60 border-2 border-gray-800 rounded-xl p-4 text-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none text-white font-semibold placeholder:text-gray-600 transition-all" 
              />
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-6"></div>
            
            <input 
              type="password" 
              placeholder="Mevcut Şifre (Zorunlu)" 
              required 
              value={profileForm.currentPassword} 
              onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})} 
              className="w-full bg-black/60 border-2 border-gray-800 rounded-xl p-4 text-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none text-white font-semibold placeholder:text-gray-600 transition-all" 
            />
            <input 
              type="password" 
              placeholder="Yeni Şifre (İsteğe Bağlı)" 
              value={profileForm.newPassword} 
              onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})} 
              className="w-full bg-black/60 border-2 border-gray-800 rounded-xl p-4 text-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none text-white font-semibold placeholder:text-gray-600 transition-all" 
            />
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-600 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95 uppercase tracking-wider text-base flex items-center justify-center gap-3">
              <Check className="w-5 h-5" />
              BİLGİLERİ KAYDET
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── HAZIR PROGRAM VERİSİ ────────────────────────────────────────────────────
const PRESET_PROGRAMS = [
  // STRENGTH
  {
    id: 1,
    category: 'Strength',
    emoji: '💪',
    name: 'Başlangıç Güç Programı',
    difficulty: 'Başlangıç',
    duration: 30,
    description: 'Kalisteniğe yeni başlayanlar için temel itme-çekme hareketleri.',
    exercises: ['Push-up × 3×10', 'Squat × 3×15', 'Dip (sandalye) × 3×8', 'Pike Push-up × 3×6'],
    color: 'from-orange-500 to-red-600',
    glow: 'orange',
  },
  {
    id: 2,
    category: 'Strength',
    emoji: '🔥',
    name: 'Üst Vücut Patlaması',
    difficulty: 'Orta',
    duration: 45,
    description: 'Pull-up ve push-up varyasyonlarıyla üst vücut güç gelişimi.',
    exercises: ['Pull-up × 4×6', 'Archer Push-up × 3×8', 'Dip × 4×10', 'Negative Muscle-up × 3×5'],
    color: 'from-red-500 to-orange-600',
    glow: 'red',
  },
  {
    id: 3,
    category: 'Strength',
    emoji: '⚡',
    name: 'Alt Vücut Dominasyonu',
    difficulty: 'Orta',
    duration: 40,
    description: 'Tek bacak hareketleriyle alt vücut gücünü zirveye taşı.',
    exercises: ['Pistol Squat × 3×5', 'Bulgarian Split Squat × 3×10', 'Jump Squat × 4×12', 'Nordic Curl × 3×6'],
    color: 'from-amber-500 to-orange-600',
    glow: 'amber',
  },

  // BALANCE
  {
    id: 4,
    category: 'Balance',
    emoji: '🧘',
    name: 'Çekirdek & Denge Temeli',
    difficulty: 'Başlangıç',
    duration: 30,
    description: 'Plank ve hollow body ile çekirdek stabilitesini inşa et.',
    exercises: ['Plank × 4×45sn', 'Hollow Body Hold × 3×30sn', 'L-Sit (paralel bar) × 3×15sn', 'Dead Bug × 3×10'],
    color: 'from-violet-500 to-purple-600',
    glow: 'violet',
  },
  {
    id: 5,
    category: 'Balance',
    emoji: '🤸',
    name: 'Handstand Yolculuğu',
    difficulty: 'Orta',
    duration: 45,
    description: 'Duvara yaslanarak başlayıp serbest handstand\'a adım at.',
    exercises: ['Frogstand × 4×20sn', 'Wall Handstand × 4×30sn', 'Crow Pose × 3×20sn', 'Headstand × 3×30sn'],
    color: 'from-purple-500 to-pink-600',
    glow: 'purple',
  },
  {
    id: 6,
    category: 'Balance',
    emoji: '🦅',
    name: 'İleri Denge Ustalığı',
    difficulty: 'İleri',
    duration: 50,
    description: 'Dragon flag ve back lever ile vücudunu kontrol et.',
    exercises: ['Dragon Flag × 3×5', 'Back Lever Hold × 3×10sn', 'Human Flag Attempt × 4×8sn', 'Straddle L-Sit × 3×15sn'],
    color: 'from-indigo-500 to-violet-600',
    glow: 'indigo',
  },

  // FLEXIBILITY
  {
    id: 7,
    category: 'Flexibility',
    emoji: '🌅',
    name: 'Sabah Aktivasyon',
    difficulty: 'Başlangıç',
    duration: 20,
    description: 'Güne enerjiyle başlamak için hafif esneme ve mobilite.',
    exercises: ['Hip Flexor Stretch × 2×60sn', 'Hamstring Stretch × 2×45sn', 'Shoulder Dislocate × 3×10', 'Cat-Cow × 2×10'],
    color: 'from-emerald-500 to-teal-600',
    glow: 'emerald',
  },
  {
    id: 8,
    category: 'Flexibility',
    emoji: '🧩',
    name: 'Derin Esneklik',
    difficulty: 'Orta',
    duration: 35,
    description: 'Köprü ve split hazırlığıyla tam vücut esnekliğine ulaş.',
    exercises: ['Bridge × 3×30sn', 'Pike Stretch × 3×60sn', 'Pancake Stretch × 3×45sn', 'Front Split Prep × 2×60sn'],
    color: 'from-teal-500 to-cyan-600',
    glow: 'teal',
  },
  {
    id: 9,
    category: 'Flexibility',
    emoji: '🌊',
    name: 'Akış & Mobilite',
    difficulty: 'Orta',
    duration: 30,
    description: 'Yoga temelli akış hareketleriyle eklem mobiliteni artır.',
    exercises: ['Sun Salutation × 3 tur', 'Pigeon Pose × 2×60sn', 'Cobra Stretch × 3×30sn', 'Thread The Needle × 2×45sn'],
    color: 'from-cyan-500 to-blue-600',
    glow: 'cyan',
  },
];

const CATEGORY_CONFIG = {
  Tümü:       { icon: <BarChart2 className="w-4 h-4" />, gradient: 'from-orange-500 to-amber-500', text: 'text-orange-400' },
  Strength:   { icon: <Shield className="w-4 h-4" />,   gradient: 'from-red-500 to-orange-500',   text: 'text-red-400' },
  Balance:    { icon: <Star className="w-4 h-4" />,     gradient: 'from-violet-500 to-purple-500', text: 'text-violet-400' },
  Flexibility:{ icon: <Feather className="w-4 h-4" />,  gradient: 'from-emerald-500 to-teal-500', text: 'text-emerald-400' },
};

function ProgramsTab({ token, refreshData }) {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [selectedProgram, setSelectedProgram] = useState(null);

  const filtered = activeCategory === 'Tümü'
    ? PRESET_PROGRAMS
    : PRESET_PROGRAMS.filter(p => p.category === activeCategory);

  return (
    <>
      {selectedProgram && (
        <ProgramPlayerModal
          program={selectedProgram}
          token={token}
          onClose={() => setSelectedProgram(null)}
          onComplete={() => { refreshData(); setSelectedProgram(null); }}
        />
      )}

  return (
    <div className="animate-in fade-in duration-700 space-y-8">

      {/* BAŞLIK */}
      <div className="relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-gray-900 via-orange-950/10 to-gray-900 border border-orange-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/40">
              <BookOpen className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 uppercase tracking-tight">
                Hazır Programlar
              </h1>
              <p className="text-gray-400 text-sm font-semibold mt-1">
                Bir program seç, egzersizleri tamamla ve kaydet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KATEGORİ FİLTRE */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${
              activeCategory === cat
                ? `bg-gradient-to-r ${cfg.gradient} text-black shadow-lg scale-105`
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
            }`}>
            {cfg.icon}
            {cat}
            <span className={`text-xs font-black ${activeCategory === cat ? 'text-black/60' : 'text-gray-600'}`}>
              {cat === 'Tümü' ? PRESET_PROGRAMS.length : PRESET_PROGRAMS.filter(p => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* PROGRAM KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(program => (
          <ProgramCard
            key={program.id}
            program={program}
            onSelect={() => setSelectedProgram(program)}
          />
        ))}
      </div>
    </div>
    </>
  );
}

function ProgramCard({ program, onSelect }) {
  const difficultyColors = {
    'Başlangıç': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Orta':      'bg-amber-500/20  text-amber-400  border-amber-500/30',
    'İleri':     'bg-red-500/20    text-red-400    border-red-500/30',
  };

  return (
    <div className="relative group flex flex-col">
      <div className={`absolute -inset-1 bg-gradient-to-r ${program.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
      <div className="relative flex flex-col flex-1 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 group-hover:border-gray-600 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">

        {/* ÜST BANT */}
        <div className={`h-1.5 bg-gradient-to-r ${program.color}`}></div>

        <div className="p-6 flex flex-col flex-1 gap-4">

          {/* BAŞLIK SATIRI */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl drop-shadow-lg">{program.emoji}</span>
              <div>
                <h3 className="text-lg font-black text-white leading-tight">{program.name}</h3>
                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${difficultyColors[program.difficulty]}`}>
                  {program.difficulty}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">{program.duration}</span>
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">dakika</span>
            </div>
          </div>

          {/* AÇIKLAMA */}
          <p className="text-gray-400 text-sm leading-relaxed">{program.description}</p>

          {/* HAREKETLİ LİSTE */}
          <div className="bg-black/40 rounded-2xl p-4 border border-gray-800/60 flex-1">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3">Hareketler</p>
            <ul className="space-y-2">
              {program.exercises.map((ex, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${program.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-[9px] font-black text-black">{i + 1}</span>
                  </div>
                  <span className="text-gray-300 font-semibold">{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BAŞLAT BUTONU */}
          <button
            onClick={onSelect}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all duration-300 active:scale-95 bg-gradient-to-r ${program.color} text-black shadow-lg opacity-90 hover:opacity-100 hover:scale-[1.02]`}>
            <Zap className="w-5 h-5" />
            Programı Başlat
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgramPlayerModal({ program, token, onClose, onComplete }) {
  const [checked, setChecked]   = useState(new Array(program.exercises.length).fill(false));
  const [saving,  setSaving]    = useState(false);
  const [done,    setDone]      = useState(false);
  const [apiLog,  setApiLog]    = useState(null);

  const doneCount  = checked.filter(Boolean).length;
  const total      = program.exercises.length;
  const pct        = total > 0 ? (doneCount / total) * 100 : 0;

  const toggle = (i) => {
    if (done) return;
    setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const handleComplete = async () => {
    if (doneCount === 0) return;
    setSaving(true);
    const endpoint = `${API_URL}/api/Workout`;
    const payload  = { name: program.name, durationMinutes: program.duration, category: program.category };
    setApiLog({ method: 'POST', endpoint, payload, status: 'GÖNDERİLİYOR...' });
    try {
      const res = await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      setApiLog({ method: 'POST', endpoint, payload, status: '201 Created', response: { id: res.data.data?.id, name: res.data.data?.name } });
      setDone(true);
      onComplete();
    } catch (err) {
      setApiLog({ method: 'POST', endpoint, payload, status: `${err.response?.status || 'Hata'}`, response: err.response?.data });
    } finally { setSaving(false); }
  };

  const diffColors = { 'Başlangıç': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', 'Orta': 'text-amber-400 bg-amber-500/10 border-amber-500/30', 'İleri': 'text-red-400 bg-red-500/10 border-red-500/30' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-lg bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">

        {/* ÜST BANT */}
        <div className={`h-1.5 bg-gradient-to-r ${program.color} flex-shrink-0`} />

        {/* HEADER */}
        <div className="flex items-start justify-between p-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-3xl">{program.emoji}</span>
            <div className="min-w-0">
              <h2 className="text-xl font-black text-white truncate">{program.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${diffColors[program.difficulty]}`}>{program.difficulty}</span>
                <span className="flex items-center gap-1 text-gray-500 text-xs font-bold"><Clock className="w-3 h-3" /> {program.duration} dk</span>
                <span className="text-xs text-gray-600 font-bold uppercase">{program.category}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ml-2 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İLERLEME */}
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">İlerleme</span>
            <span className={`text-sm font-black bg-gradient-to-r ${program.color} bg-clip-text text-transparent`}>{doneCount}/{total}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${program.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
          </div>
          {doneCount === total && !done && (
            <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> Tüm egzersizleri tamamladın!</p>
          )}
        </div>

        {/* EGZERSİZ LİSTESİ */}
        <div className="px-6 overflow-y-auto flex-1">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3">Egzersizler</p>
          <div className="space-y-2 pb-4">
            {program.exercises.map((ex, i) => (
              <button key={i} onClick={() => toggle(i)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                  checked[i]
                    ? `bg-gradient-to-r ${program.color} bg-opacity-10 border-transparent`
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-600'
                }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs transition-all ${
                  checked[i] ? 'bg-white/20 text-white' : `bg-gradient-to-r ${program.color} text-black`
                }`}>
                  {checked[i] ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`font-semibold text-sm flex-1 ${checked[i] ? 'text-white/50 line-through' : 'text-gray-200'}`}>{ex}</span>
                {checked[i] && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* TAMAMLA & API LOG */}
        <div className="p-6 pt-4 border-t border-gray-900 flex-shrink-0 space-y-3">
          {!done ? (
            <button onClick={handleComplete} disabled={saving || doneCount === 0}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all duration-300 ${
                doneCount > 0
                  ? `bg-gradient-to-r ${program.color} text-black shadow-lg hover:scale-[1.02] active:scale-95`
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}>
              {saving ? (
                <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Kaydediliyor...</>
              ) : (
                <><Dumbbell className="w-5 h-5" />
                  {doneCount === total ? 'Antrenmanı Tamamla' : `${doneCount} Egzersiz ile Kaydet`}
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Trophy className="w-10 h-10 text-emerald-400" />
              <p className="text-emerald-400 font-black text-lg">Antrenman Kaydedildi!</p>
              <p className="text-gray-400 text-sm text-center">{program.name} geçmişine eklendi.</p>
              <button onClick={onClose} className="px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-black rounded-xl border border-emerald-500/30 transition-colors text-sm">
                Kapat
              </button>
            </div>
          )}

          {/* API LOG */}
          {apiLog && (
            <div className="bg-black rounded-2xl p-4 border border-orange-500/20">
              <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-2">API ISTEK / YANIT</p>
              <p className="text-gray-500 text-[11px]"><span className="text-amber-500 font-bold">Metod: </span>{apiLog.method}</p>
              <p className="text-gray-500 text-[11px] break-all"><span className="text-amber-500 font-bold">Endpoint: </span>{apiLog.endpoint}</p>
              <p className="text-gray-500 text-[11px]"><span className="text-amber-500 font-bold">Istek: </span>{JSON.stringify(apiLog.payload)}</p>
              <p className={`text-[11px] font-bold ${apiLog.status.includes('201') || apiLog.status.includes('200') ? 'text-emerald-400' : apiLog.status.includes('GÖN') ? 'text-amber-400' : 'text-red-400'}`}>
                <span className="text-amber-500">Durum: </span>{apiLog.status}
              </p>
              {apiLog.response && <p className="text-gray-500 text-[11px]"><span className="text-amber-500 font-bold">Yanit: </span>{JSON.stringify(apiLog.response)}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/Notification`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setNotifications(res.data.data || res.data || []);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchNotifications();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Bell className="w-16 h-16 text-orange-500 animate-bounce mb-4" />
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all"></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/30">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase">Bildirim Merkezi</h2>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notif, idx) => (
                <div key={idx} className="group/notif relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover/notif:from-orange-500/30 group-hover/notif:to-amber-500/30 rounded-2xl blur-md transition-all"></div>
                  <div className="relative bg-gradient-to-r from-gray-900 to-gray-950 border-l-4 border-orange-500 p-6 rounded-r-2xl shadow-lg group-hover/notif:shadow-orange-500/20 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Bell className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold leading-relaxed text-base">{notif.message || notif.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Calendar className="w-3 h-3 text-gray-600" />
                          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
                            {new Date(notif.createdAt).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-2xl opacity-20"></div>
                  <Bell className="relative w-32 h-32 text-gray-800 opacity-10" />
                </div>
                <p className="text-gray-600 font-black uppercase tracking-widest text-base mb-2">Henüz bildirim yok</p>
                <p className="text-gray-700 text-sm">Antrenman yaptıkça bildirimler gelecek.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');
    const endpoint = isLogin ? '/api/Auth/login' : '/api/Auth/register';
    
    try {
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        setToken(response.data.data.token);
      }
    } catch (err) { 
      setError(err.response?.data?.message || 'Bir hata oluştu. Tekrar dene.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-black selection:bg-orange-500 selection:text-black relative overflow-hidden">
      {/* ARKA PLAN ANİMASYONLARI */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500/30 rounded-3xl p-10 shadow-[0_0_80px_-12px_rgba(249,115,22,0.4)]">
          
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-2xl transform hover:rotate-6 transition-transform">
                <Dumbbell className="w-14 h-14 text-black" />
              </div>
            </div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 mb-3 tracking-tighter uppercase">
              ASHURA FORGE
            </h2>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              {isLogin ? '🔥 Savaşa hazır mısın?' : '⚡ Efsanelerin arasına katıl'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-2xl text-red-400 text-xs font-black text-center uppercase tracking-widest animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Kullanıcı Adı" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-black/60 border-2 border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-bold placeholder:text-gray-600" 
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="email" 
                name="email" 
                placeholder="E-posta Adresi" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full bg-black/60 border-2 border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-bold placeholder:text-gray-600" 
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="password" 
                name="password" 
                placeholder="Şifre" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="w-full bg-black/60 border-2 border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-bold placeholder:text-gray-600" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-black font-black rounded-2xl py-5 mt-6 transition-all shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-base">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                  KAPILAR AÇILIYOR...
                </>
              ) : (
                <>
                  {isLogin ? 'GİRİŞ YAP' : 'KAYIT OL'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-gray-500 hover:text-orange-500 text-sm font-black uppercase tracking-widest transition-colors group">
              {isLogin ? (
                <>Hesabın yok mu? <span className="text-orange-500 group-hover:text-amber-500">Hemen oluştur</span></>
              ) : (
                <>Zaten bir savaşçı mısın? <span className="text-orange-500 group-hover:text-amber-500">Giriş yap</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS için özel animasyonlar
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #f97316, #f59e0b);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #ea580c, #d97706);
  }
`;
document.head.appendChild(style);
