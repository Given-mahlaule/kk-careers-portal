import Input from '../ui/Input';
import Select from '../ui/Select';

const countries = [
  { value: 'ZA', label: 'South Africa' },
  { value: 'BW', label: 'Botswana' },
  { value: 'ZW', label: 'Zimbabwe' },
  { value: 'other', label: 'Other' }
];

export default function ProfileInformation({ data, onUpdate, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Profile Information</h2>
        <p className="text-sm text-gray-600">Please provide your basic personal information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Input
          label="First Name"
          name="firstName"
          value={data.firstName || ''}
          onChange={handleChange}
          required
          error={errors?.firstName}
        />

        <Input
          label="Last Name"
          name="lastName"
          value={data.lastName || ''}
          onChange={handleChange}
          required
          error={errors?.lastName}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={data.email || ''}
          onChange={handleChange}
          required
          error={errors?.email}
          className="lg:col-span-2"
        />

        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={data.phoneNumber || ''}
          onChange={handleChange}
          required
          error={errors?.phoneNumber}
          placeholder="e.g., 0726663821"
        />

        <Input
          label="House Number"
          name="houseNumber"
          value={data.houseNumber || ''}
          onChange={handleChange}
          error={errors?.houseNumber}
        />

        <Input
          label="Street Name"
          name="streetName"
          value={data.streetName || ''}
          onChange={handleChange}
          error={errors?.streetName}
          className="lg:col-span-2"
        />

        <Input
          label="City"
          name="city"
          value={data.city || ''}
          onChange={handleChange}
          required
          error={errors?.city}
        />

        <Input
          label="ZIP / Post Code"
          name="zipCode"
          value={data.zipCode || ''}
          onChange={handleChange}
          error={errors?.zipCode}
        />

        <Select
          label="Country of Residence"
          name="country"
          value={data.country || ''}
          onChange={handleChange}
          options={countries}
          required
          error={errors?.country}
          className="lg:col-span-2"
        />
      </div>
    </div>
  );
}