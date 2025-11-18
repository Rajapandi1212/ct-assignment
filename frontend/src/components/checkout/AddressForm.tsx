'use client';

import { useState, useEffect } from 'react';
import { updateCartAddresses } from '@/services/cart.service';
import { useLocale } from '@/contexts/LocaleContext';
import { useCartLoading } from '@/contexts/CartLoadingContext';

interface Address {
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface AddressFormProps {
  title: string;
  address: Address | null;
  onAddressChange: (address: Address) => void;
  cartCountry: string;
}

export default function AddressForm({
  title,
  address,
  onAddressChange,
  cartCountry,
}: AddressFormProps) {
  const { locale } = useLocale();
  const { setCartLoading } = useCartLoading();
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>(
    {}
  );

  const [formData, setFormData] = useState<Address>(
    address || {
      firstName: '',
      lastName: '',
      streetName: '',
      streetNumber: '',
      city: '',
      postalCode: '',
      country: cartCountry,
      phone: '',
      email: '',
    }
  );

  // Update form when address prop changes
  useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  // Check if form is complete (all required fields filled)
  const isFormComplete = () => {
    return (
      formData.firstName.trim().length >= 2 &&
      formData.lastName.trim().length >= 2 &&
      formData.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.phone.trim().length > 9 &&
      formData.phone.trim().length < 13 &&
      /^\+?[\d\s-()]+$/.test(formData.phone) &&
      formData.streetName.trim().length >= 2 &&
      formData.city.trim().length >= 2 &&
      formData.postalCode.trim().length >= 4 &&
      formData.country.trim().length > 0
    );
  };

  const validateField = (name: keyof Address, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Invalid email address'
          : '';
      case 'phone':
        return !/^\+?[\d\s-()]+$/.test(value) ? 'Invalid phone number' : '';
      case 'postalCode':
        return value.trim().length < 3 ? 'Invalid postal code' : '';
      case 'streetName':
      case 'city':
        return value.trim().length < 2 ? 'This field is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    onAddressChange(newFormData);

    // Clear error on change
    if (errors[name as keyof Address]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof Address, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSave = async () => {
    // Validate all fields
    const newErrors: Partial<Record<keyof Address, string>> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key as keyof Address,
        formData[key as keyof Address]
      );
      if (error) {
        newErrors[key as keyof Address] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaveMessage({ type: 'error', text: 'Please fix all errors' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    setCartLoading(true);
    setSaveMessage(null);

    const response = await updateCartAddresses(formData, locale);

    setCartLoading(false);
    if (response.success) {
      setSaveMessage({ type: 'success', text: 'Address saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage({
        type: 'error',
        text: response.error?.message || 'Failed to save address',
      });
    }

    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      {/* Mobile/Tablet Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-display font-semibold text-neutral-900">
          {title}
        </h2>
        <svg
          className={`w-5 h-5 text-neutral-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-display font-semibold text-neutral-900">
          {title}
        </h2>
      </div>

      {/* Form Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[1000px]' : 'max-h-0'
        } lg:max-h-none`}
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`${title}-firstName`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                id={`${title}-firstName`}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-neutral-300'
                }`}
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${title}-lastName`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                id={`${title}-lastName`}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-neutral-300'
                }`}
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${title}-email`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id={`${title}-email`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-neutral-300'
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${title}-phone`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Phone *
              </label>
              <input
                type="tel"
                id={`${title}-phone`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-neutral-300'
                }`}
                required
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${title}-streetName`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Street Name *
              </label>
              <input
                type="text"
                id={`${title}-streetName`}
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.streetName ? 'border-red-500' : 'border-neutral-300'
                }`}
                required
              />
              {errors.streetName && (
                <p className="mt-1 text-xs text-red-600">{errors.streetName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${title}-streetNumber`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Street Number
              </label>
              <input
                type="text"
                id={`${title}-streetNumber`}
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor={`${title}-city`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                City *
              </label>
              <input
                type="text"
                id={`${title}-city`}
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-neutral-300'
                }`}
                required
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${title}-postalCode`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Postal Code *
              </label>
              <input
                type="text"
                id={`${title}-postalCode`}
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.postalCode ? 'border-red-500' : 'border-neutral-300'
                }`}
                required
              />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${title}-country`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Country *
              </label>
              <input
                type="text"
                id={`${title}-country`}
                name="country"
                value={formData.country}
                disabled
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isFormComplete()}
              className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Save Address</span>
                </>
              )}
            </button>

            {!isFormComplete() && !isSaving && (
              <p className="mt-2 text-xs text-center text-neutral-500">
                Please fill in all required fields to save
              </p>
            )}

            {saveMessage && (
              <div
                className={`mt-3 p-3 rounded-lg border ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <p className="text-sm">{saveMessage.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
