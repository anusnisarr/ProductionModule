import Select from 'react-select';

const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#2D2D2D',
      borderColor: state.isFocused ? 'var(--primary)' : '#3D3D3D',
      color: 'var(--text-light)',
      padding: '2px', // fine-tuning control height
      minHeight: '40px', // avoid big height
      boxShadow: state.isFocused ? '0 0 0 2px rgba(76, 175, 80, 0.3)' : 'none',
      '&:hover': {
        borderColor: 'var(--primary)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#2D2D2D',
      border: '1px solid #3D3D3D',
      color: 'var(--text-light)',
      zIndex: 5,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#3D3D3D' : '#2D2D2D',
      color: 'var(--text-light)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#3D3D3D',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-light)',
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--text-light)',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#aaaaaa', // a lighter gray for placeholder
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'var(--text-light)',
      '&:hover': {
        color: 'var(--primary)',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

const options = [];

try{
    const response  = await fetch('http://localhost:3000/items/api/')
    if(!response.ok) {
        console.error('Network response was not ok', response.statusText);
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
  
    options.push(...data.map(item => ({
        value: item.itemName,
        label: `${item.itemCode} | (${item.itemName})`,
        itemCode: item.itemCode,
        itemType: item.itemType,
        itemId: item.itemId,
    })));
}
catch (error) {
    console.error('Error fetching items:', error);
}   

export default function MySelect({ onChange, value }) {
    return (

          <Select
            options={options}
            styles={customSelectStyles}
            placeholder="Select Item"
            onChange={(selectedOption) => onChange(selectedOption)}
            value={options.find(opt => opt.value === value) || null}
          />

      );
    }

