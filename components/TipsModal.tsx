import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image,
  StatusBar 
} from 'react-native';

interface TipsModalProps {
  visible: boolean;
  onClose: () => void;
  tipsType: 'app-usage' | 'eco-bricks' | 'recycling';
}

const TipsModal: React.FC<TipsModalProps> = ({ visible, onClose, tipsType }) => {
  const getTipsContent = () => {
    switch (tipsType) {
      case 'app-usage':
        return {
          title: 'Cara Pakai Aplikasi Lumbung Hijau',
          subtitle: 'Kelola sampah organik jadi kompos berkelanjutan',
          icon: require('../assets/images/icon/handphone.png'),
          steps: [
            {
              step: 1,
              title: 'Pilih dan Bersihin Plastikmu',
              description: 'Pastikan plastik sudah dicuci bersih dan kering dari sisa-sisa. Pisahkan berdasarkan jenisnya (botol, kemasan, dll.)'
            },
            {
              step: 2,  
              title: 'Siapkan Alat & Bahan',
              description: 'Kamu memerlih botol plastik bekas dan batang untuk memadatkan sesuai dengan isi kerjasamamu.'
            },
            {
              step: 3,
              title: 'Temukan ide kreatif',
              description: 'Cari inspirasi di internet, buku kerajinan, atau majalah. Boleh plastik bisa jadi pot bunga, celengan, atau tempat pensil unik.'
            },
            {
              step: 4,
              title: 'Mulai berkreasi',
              description: 'Ikema sendiri! Jangan takut mencoba hal baru dan bereksperimen dengan ide tanggal bentuk.'
            },
            {
              step: 5,
              title: 'Sempurnakan Hasil Karyamu',
              description: 'Tambahkan sentuhan akhir seperti cat, manik-manik, hiasan atau memberikan detail lain agar kerjamamu makin menarik.'
            }
          ]
        };
      case 'eco-bricks':
        return {
          title: 'Cara membuat eco bricks',
          subtitle: 'Ubah sampah plastik jadi bata ramah lingkungan',
          icon: require('../assets/images/icon/handphone.png'),
          steps: [
            {
              step: 1,
              title: 'Siapkan Botol Plastik',
              description: 'Gunakan botol plastik bekas yang bersih dan kering. Pastikan tidak ada lubang atau kerusakan.'
            },
            {
              step: 2,
              title: 'Kumpulkan Sampah Plastik',
              description: 'Kumpulkan sampah plastik bersih seperti kantong plastik, bungkus makanan, dan kemasan lainnya.'
            },
            {
              step: 3,
              title: 'Masukkan dan Padatkan',
              description: 'Masukkan sampah plastik ke dalam botol sambil dipadatkan menggunakan tongkat kayu.'
            },
            {
              step: 4,
              title: 'Isi Hingga Padat',
              description: 'Terus isi dan padatkan hingga botol benar-benar padat dan keras seperti batu bata.'
            },
            {
              step: 5,
              title: 'Eco Brick Siap Digunakan',
              description: 'Eco brick yang sudah jadi dapat digunakan untuk membuat furniture, dinding, atau dekorasi.'
            }
          ]
        };
      case 'recycling':
        return {
          title: 'Tips daur ulang sampah',
          subtitle: 'Panduan lengkap mengelola sampah rumah tangga',
          icon: require('../assets/images/icon/handphone.png'),
          steps: [
            {
              step: 1,
              title: 'Pisahkan Berdasarkan Jenis',
              description: 'Pisahkan sampah organik, plastik, kertas, dan logam ke dalam wadah terpisah.'
            },
            {
              step: 2,
              title: 'Bersihkan Sebelum Membuang',
              description: 'Cuci bersih wadah makanan dan minuman sebelum dibuang ke tempat daur ulang.'
            },
            {
              step: 3,
              title: 'Manfaatkan Sampah Organik',
              description: 'Ubah sampah organik menjadi kompos untuk pupuk tanaman di rumah.'
            },
            {
              step: 4,
              title: 'Kreasikan Barang Bekas',
              description: 'Ubah barang bekas menjadi kerajinan tangan yang berguna dan bernilai ekonomis.'
            },
            {
              step: 5,
              title: 'Bagikan ke Bank Sampah',
              description: 'Serahkan sampah yang sudah dipilah ke bank sampah terdekat untuk didaur ulang.'
            }
          ]
        };
      default:
        return {
          title: '',
          subtitle: '',
          icon: null,
          steps: []
        };
    }
  };

  const tipsContent = getTipsContent();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Image
              source={require('../assets/images/icon/arrow-left.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tips-Tips</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Tips Header Card */}
          <View style={styles.tipsHeaderCard}>
            <View style={styles.tipsIconContainer}>
              <View style={styles.iconBackground}>
                <Image source={tipsContent.icon} style={styles.tipsIcon} />
              </View>
            </View>
            <Text style={styles.tipsTitle}>{tipsContent.title}</Text>
            <Text style={styles.tipsSubtitle}>{tipsContent.subtitle}</Text>
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsHeader}>Langkah - langkah:</Text>
            {tipsContent.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{step.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_600SemiBold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tipsHeaderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  tipsIconContainer: {
    marginBottom: 15,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  tipsIcon: {
    width: 45,
    height: 45,
    tintColor: '#fff',
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
  },
  tipsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  stepsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  stepsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    fontFamily: 'Poppins_600SemiBold',
  },
  stepDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    fontFamily: 'Poppins_400Regular',
  },
});

export default TipsModal;