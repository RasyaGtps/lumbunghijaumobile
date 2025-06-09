import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native'
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins'

const { width } = Dimensions.get('window')

interface Article {
  id: string
  title: string
  image: any
  content: string
  author: string
  publishDate: string
}

export default function Artikel() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  // Load font menggunakan useFonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  // Data artikel dummy - dalam implementasi nyata, ini akan diambil dari API
  const articles: Article[] = [
    {
      id: '1',
      title: 'ECO Bricks solusi atasi sampah masa kini',
      image: require('../assets/images/icon/ecobrick.avif'),
      author: 'Lumbung Hijau',
      publishDate: '2 bulan yang lalu',
      content: `
Apa itu Eco Bricks?

Eco Bricks adalah botol plastik yang diisi padat dengan sampah plastik bersih dan kering hingga menjadi sangat keras dan padat, menyerupai batu bata. Tujuan utamanya adalah untuk mengurangi atau "sekuestrasi" sampah plastik agar tidak mencemari lingkungan dan memberikan nilai guna baru.

Mengapa Eco Bricks Penting?

1. Mengurangi Sampah Plastik: Ini adalah cara efektif untuk mengurangi volume sampah plastik yang berakhir di tempat pembuangan akhir (TPA) atau mencemari alam. Setiap botol Eco Brick menyimpan ratusan gram plastik yang seharusnya akan mencemari.

2. Solusi Jangka Panjang: Dengan dikemas padat di dalam botol, sampah plastik tidak lagi tersebar dan mencemari. Ini membantu menjaga sampah plastik dari siklus pembakaran atau pembuangan yang merugikan lingkungan.

3. Bahan Bangunan Ramah Lingkungan: Eco Bricks dapat digunakan sebagai bahan bangunan modular untuk membuat furniture, dinding, bermain, tembok non-struktural, atau bahkan bangunan kecil. Ini adalah alternatif yang ramah lingkungan dan terjangkau.

4. Edukasi dan Kesadaran: Proses pembuatan Eco Bricks mendorong kesadaran tentang konsumsi plastik dan pentingnya mengelola sampah serta bertanggung jawab. Ini adalah kegiatan yang bisa melibatkan seluruh keluarga dan komunitas.

Bagaimana Cara Membuat Eco Bricks?

Pembuatan Eco Bricks sangat mudah dan bisa dilakukan siapa saja:

5. Siapkan Botol Plastik: Gunakan botol PET bekas berbagai ukuran (biasanya botol 600ml atau 1.5L). Pastikan botol bersih dan kering.

6. Kumpulkan Sampah Plastik Bersih dan Kering: Ini bisa berupa sisa makanan atau cairan dan benar-benar kering. Contohnya adalah bungkus makanan plastik, bungkus sabun, sedotan, atau plastik lainnya. Pastikan semua sampah plastik bersih dari sisa makanan atau cairan dan benar-benar kering.

7. Padatkan Sampah ke dalam Botol: Masukkan sampah plastik sedikit demi sedikit ke dalam botol. Gunakan tongkat atau alat lain untuk memadatkan setiap lapisan sampah hingga sangat padat. Kepulangan adalah kunci agar Eco Brick kuat dan tahan lama.

8. Capai kepadatan Optimal: Terus padatkan hingga botol terasa sangat keras. Tidak boleh dicupcet, dan beratnya sesuai standar (misalnya, botol 600ml bisa mencapai berat 200-250 gram atau 1.5L bisa 500-600 gram).

9. Tutup Rapat: Setelah padat, tutup botol rapat-rapat. Eco Brick siap digunakan!

Kesimpulan

Yuk, Mulai Buat Eco Bricks!

Eco Bricks bukan hanya tentang mendaur ulang sampah, tetapi juga tentang mengubah pola pikir kita terhadap konsumsi. Dengan setiap botol yang kita isi, kita tidak hanya mengurangi sampah, tetapi juga turut membangun masa depan yang lebih bersih dan berkelanjutan. Mari bersama-sama menjadi bagian dari solusi dan jadikan Eco Bricks sebagai gaya hidup baru kita untuk melindungi Bumi masa kini!
      `
    },
    {
      id: '2',
      title: 'Ubah sampah kaca menjadi wadah makanan',
      image: require('../assets/images/icon/kaca.jpg'),
      author: 'Lumbung Hijau',
      publishDate: '1 bulan yang lalu',
      content: `
Mengubah sampah kaca menjadi wadah makanan adalah cara kreatif dan berkelanjutan untuk mengurangi limbah dan memberikan nilai baru pada barang bekas. Berikut adalah langkah-langkah dan tips untuk melakukannya dengan aman dan efektif.

Mengapa Kaca Ideal untuk Wadah Makanan?

Kaca adalah bahan yang inert, artinya tidak bereaksi dengan makanan atau minuman. Ini menjadikannya pilihan yang aman dan sehat untuk menyimpan berbagai jenis makanan, dari sisa masakan hingga bumbu dapur. Daur ulang kaca juga menghemat energi yang signifikan dibandingkan produksi kaca baru.

Langkah-Langkah Mengubah Kaca Bekas Menjadi Wadah Makanan:

1.  Pilih dan Bersihkan Kaca:
     Pilih botol atau toples kaca yang bersih dan tidak retak. Bekas selai, saus, atau minuman adalah pilihan yang baik.
     Cuci bersih kaca dengan sabun dan air panas untuk menghilangkan sisa makanan atau label. Untuk label yang sulit, rendam dalam air panas dan soda kue.

2.  Sterilisasi (Penting untuk Keamanan Pangan):
     Didihkan toples kaca dalam air selama 10-15 menit untuk mensterilkan dan menghilangkan bakteri.
     Alternatifnya, panaskan toples di oven dengan suhu 100-120°C selama 15-20 menit. Pastikan toples benar-benar kering sebelum digunakan.

3.  Penyimpanan yang Tepat:
     Gunakan wadah kaca yang sudah disiapkan untuk menyimpan bahan makanan kering seperti pasta, beras, kacang-kacangan, atau rempah-rempah.
     Untuk makanan yang disimpan di kulkas, pastikan wadah tertutup rapat untuk menjaga kesegaran.

4.  Kreativitas dan Personalisasi:
     Tambahkan label yang menarik atau hias toples dengan cat kaca non-toksik untuk tampilan yang lebih estetis dan terorganisir.
     Anda bisa juga menggunakan toples kaca untuk membuat makanan yang diawetkan seperti acar atau selai buatan sendiri.

Dengan mengubah sampah kaca menjadi wadah makanan, Anda tidak hanya berkontribusi pada pengurangan limbah, tetapi juga menciptakan solusi penyimpanan yang praktis dan ramah lingkungan di rumah Anda.
    `
    },
    {
      id: '3',
      title: 'Ubah sampah kardus menjadi kerajinan tangan',
      image: require('../assets/images/icon/kardus.jpg'),
      author: 'Lumbung Hijau',
      publishDate: '3 minggu yang lalu',
      content: `
Sampah kardus sering kali menumpuk di rumah, tetapi dengan sedikit kreativitas, Anda bisa mengubahnya menjadi berbagai kerajinan tangan yang unik dan bermanfaat. Ini adalah cara yang menyenangkan untuk mengurangi limbah dan mengekspresikan sisi artistik Anda.

Mengapa Kardus Cocok untuk Kerajinan Tangan?

Kardus adalah bahan yang mudah didapat, murah, dan sangat fleksibel untuk dibentuk. Teksturnya yang kokoh menjadikannya ideal untuk membuat struktur tiga dimensi, sedangkan permukaannya mudah diwarnai, ditempel, atau dipotong.

Ide Kerajinan Tangan dari Sampah Kardus:

1.  Kotak Penyimpanan Dekoratif:
     Ubah kotak kardus bekas sepatu atau kemasan lainnya menjadi kotak penyimpanan yang menarik untuk pernak-pernik, alat tulis, atau mainan. Hias dengan kertas kado, kain perca, atau cat.

2.  Rumah Mainan atau Kastil Miniatur:
     Kardus besar (misalnya bekas kulkas atau mesin cuci) dapat diubah menjadi rumah boneka, benteng, atau terowongan bermain untuk anak-anak. Libatkan anak-anak dalam proses pembuatannya untuk mengembangkan kreativitas mereka.

3.  Bingkai Foto atau Cermin Unik:
     Potong kardus menjadi bentuk bingkai dan hias dengan tekstur, warna, atau aksesoris lain. Ini bisa menjadi proyek yang mudah dan personal.

4.  Organizer Meja atau Laci:
     Potong-potong kardus menjadi sekat-sekat dan rekatkan untuk membuat organizer kustom di meja kerja atau laci Anda.

5.  Proyek Seni 3D dan Patung:
     Gunakan lapisan kardus yang berbeda untuk membuat patung, model arsitektur, atau relief dinding. Kardus dapat dipotong, dilipat, dan direkatkan untuk menciptakan efek dimensi.
`
    }
  ]

  useEffect(() => {
    // Simulasi loading dan pencarian artikel berdasarkan ID
    const timer = setTimeout(() => {
      const foundArticle = articles.find(article => article.id === id)
      setArticle(foundArticle || articles[0]) // Default ke artikel pertama jika tidak ditemukan
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [id])

  // Tampilkan loading kalau font belum siap
  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    )
  }

  // Perbaikan: Pastikan styles.backButton dan styles.backButtonText didefinisikan untuk digunakan di sini
  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Artikel tidak ditemukan</Text>
        <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
          <Text style={styles.errorBackButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header dengan navigasi kembali */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require('../assets/images/icon/arrow-left.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Artikel</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={article.image} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
        </View>

        {/* Article Content */}
        <View style={styles.contentContainer}>
          {/* Article Meta */}
          <View style={styles.metaContainer}>
            <Text style={styles.authorText}>oleh {article.author}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.dateText}>{article.publishDate}</Text>
          </View>

          {/* Article Title */}
          <Text style={styles.articleTitle}>{article.title}</Text>

          {/* Article Content */}
          <View style={styles.articleContent}>
            {article.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null

              // Check if it's a heading (lines that end with ? or : or are short and bold-looking)
              const isHeading = paragraph.length < 50 &&
                (paragraph.includes('?') || paragraph.includes(':') ||
                  paragraph.includes('Apa itu') || paragraph.includes('Mengapa') ||
                  paragraph.includes('Bagaimana') || paragraph.includes('Kesimpulan') ||
                  /^\d+\./.test(paragraph.trim()))

              return (
                <Text
                  key={index}
                  style={isHeading ? styles.contentHeading : styles.contentParagraph}
                >
                  {paragraph.trim()}
                </Text>
              )
            })}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  // START ADDITIONS FOR ERROR CONTAINER BACK BUTTON
  errorBackButton: { // A new style for the back button in error screen
    width: 100, // Example width
    height: 40, // Example height
    borderRadius: 8,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  errorBackButtonText: { // A new style for the text in the back button in error screen
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  // END ADDITIONS FOR ERROR CONTAINER BACK BUTTON
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 240,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  contentContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Poppins_400Regular',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Poppins_400Regular',
  },
  readTimeText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Poppins_400Regular',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 32,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
  },
  articleContent: {
    marginBottom: 30,
  },
  contentHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 24,
  },
  contentParagraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'justify',
  },
  shareSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  likeButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  likeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  bottomSpacing: {
    height: 40,
  },
})