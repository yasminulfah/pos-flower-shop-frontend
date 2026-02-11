function PackagingSelector({ packagings, selectedPackaging, setSelectedPackaging }) {
  return (
    <select
      className="w-full border p-2 rounded"
      value={selectedPackaging}
      onChange={(e) => setSelectedPackaging(e.target.value)}
      required
    >
      <option value="">Select Packaging</option>
      {Array.isArray(packagings) && packagings.map((p) => (
        <option key={p.id} value={p.id}>
          {p.packaging_name} - Rp {Number(p.base_packaging_cost).toLocaleString('id-ID')}
        </option>
      ))}
    </select>
  );
}
export default PackagingSelector;