export function mapCustomerDtoToModel(dto) {
  if (!dto) return null;

  return {
    id: dto.id,
    name: dto.name,
    phone: dto.phone,
    email: dto.email,
    city: dto.city,
    isActive: dto.isActive ?? true,
  };
}
