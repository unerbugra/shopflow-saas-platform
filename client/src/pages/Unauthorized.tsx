export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">403 Yetkisiz Erişim</h1>
      <p className="mt-4 text-lg text-gray-700">Bu sayfaya erişim yetkiniz yok.</p>
    </div>
  );
}