interface AnalyzeResult {
    skor_kecocokan: {
        nilai: number;
        alasan: string;
    };
    perbaikan: {
        bagian: string;
        masalah: string;
        saran: string;
    }[];
    kata_kunci_hilang: string[];
    rekomendasi: {
        tema: string;
        aksi: string;
        dampak: string;
        prioritas: 'tinggi' | 'sedang' | 'rendah';
    }[];
    cv_diperbarui: {
        konten: string;
    };
    catatan: string[];
}

export default AnalyzeResult;