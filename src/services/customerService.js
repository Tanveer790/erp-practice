import { mapCustomerDtoToModel } from '../models/customers/customerModel.js';


// TODO: baad me isko httpClient se real API call bana dena
export default async function fetchCustomersApi() {
  // fake latency
  await new Promise((r) => setTimeout(r, 400));

  const fakeDto = [
    {
      id: 1,
      name: 'ABC Trading Co.',
      phone: '0551234567',
      email: 'info@abctrading.com',
      city: 'Jeddah',
      isActive: true,
    },
    {
      id: 2,
      name: 'Matrix Meras',
      phone: '0126123456',
      email: 'support@matrixmeras.com',
      city: 'Jeddah',
      isActive: true,
    },
  ];

  return fakeDto.map(mapCustomerDtoToModel);
}
