import { AutoComplete, Select } from 'antd'
import type { SelectProps } from 'antd'

type Option = { label: string; value: string }

type Props = {
  value?: string | string[]
  onChange?: (val: any) => void
  options?: Array<string | Option>
  allowCreate?: boolean
  multiple?: boolean
  placeholder?: string
  style?: React.CSSProperties
}

export default function OptionInput({ value, onChange, options = [], allowCreate = false, multiple = false, placeholder, style }: Props) {
  const opts: Option[] = options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))

  if (allowCreate) {
    if (multiple) {
      // 可新增多選：以 Select tags 模式
      const props: SelectProps<string[]> = {
        mode: 'tags',
        value: (value as string[]) ?? [],
        onChange,
        options: opts,
        placeholder,
        style,
        showSearch: true,
        filterOption: (input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
      }
      return <Select {...props} />
    }
    // 可新增單選：AutoComplete 允許自由輸入
    return (
      <AutoComplete
        value={(value as string) ?? ''}
        onChange={onChange}
        options={opts.map((o) => ({ value: o.value }))}
        placeholder={placeholder}
        style={style}
        filterOption={(inputValue, option) => (option?.value ?? '').toString().toLowerCase().includes(inputValue.toLowerCase())}
      />
    )
  }

  // 僅能選擇既有選項
  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value as any}
      onChange={onChange}
      options={opts}
      placeholder={placeholder}
      style={style}
      showSearch
      filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
    />
  )
}

