export class SettingType<T> {
  name: string;
  required: boolean;
  type: string;
  default: T;
  description?: string;

  constructor(props: { type: string; name: string; required: boolean; default: T; description?: string }) {
    this.name = props.name;
    this.required = props.required;
    this.type = props.type;
    this.default = props.default;
    this.description = props.description;
  }
}

export class ToggleButton extends SettingType<boolean> {
  constructor(props: { name: string; default?: boolean; required?: boolean; description?: string }) {
    super({
      type: 'toggle',
      name: props.name,
      required: props.required ?? false,
      default: props.default ?? false,
      description: props.description,
    });
  }
}

export class Slider extends SettingType<number> {
  start: number = 0;
  end: number = 100;
  constructor(props: {
    name: string;
    default?: number;
    required?: boolean;
    description?: string;
    start?: number;
    end?: number;
  }) {
    super({
      type: 'slider',
      name: props.name,
      required: props.required ?? false,
      default: props.default ?? 50,
      description: props.description,
    });
    if (props?.start) this.start = props.start;
    if (props?.end) this.end = props.end;
  }
}

export class ColorPicker extends SettingType<string> {
  constructor(props: { name: string; default?: string; required?: boolean; description?: string }) {
    super({
      type: 'colorPicker',
      name: props.name,
      required: props.required ?? false,
      default: props.default ?? 'black',
      description: props.description,
    });
  }
}

export class SingleSelect extends SettingType<{ value: any; label: string }> {
  list: { value: any; label: string }[] = [];
  constructor(props: {
    name: string;
    default?: { value: any; label: string };
    required?: boolean;
    description?: string;
    list?: { value: any; label: string }[];
  }) {
    super({
      type: 'singleSelect',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? { value: '', label: '' },
      description: props.description,
    });
    if (props?.list) this.list = props.list;
  }
}

export class MultiSelect extends SettingType<{ value: any; label: string }[]> {
  list: { value: any; label: string }[] = [];
  constructor(props: {
    name: string;
    default?: { value: any; label: string }[];
    required?: boolean;
    description?: string;
    list?: { value: any; label: string }[];
  }) {
    super({
      type: 'multiSelect',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? [{ value: '', label: '' }],
      description: props.description,
    });
    if (props?.list) this.list = props.list;
  }
}

export class TextField extends SettingType<string> {
  minCharacter: number = 0;
  maxCharacter: number = 256;
  placeholder: string = '';
  constructor(props: {
    name: string;
    default?: string;
    required?: boolean;
    description?: string;
    minCharacter?: number;
    maxCharacter?: number;
    placeholder?: string;
  }) {
    super({
      type: 'textField',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? '',
      description: props.description,
    });
    if (props?.minCharacter) this.minCharacter = props.minCharacter;
    if (props?.maxCharacter) this.maxCharacter = props.maxCharacter;
    if (props?.placeholder) this.placeholder = props.placeholder;
  }
}

export class NumberField extends SettingType<number> {
  minCharacter: number = 0;
  maxCharacter: number = 256;
  constructor(props: {
    name: string;
    default?: number;
    required?: boolean;
    description?: string;
    minCharacter?: number;
    maxCharacter?: number;
  }) {
    super({
      type: 'numberField',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? 0,
      description: props.description,
    });
    if (props?.minCharacter) this.minCharacter = props.minCharacter;
    if (props?.maxCharacter) this.maxCharacter = props.maxCharacter;
  }
}

export class EmailField extends SettingType<string> {
  constructor(props: { name: string; default?: string; required?: boolean; description?: string }) {
    super({
      type: 'emailField',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? '',
      description: props.description,
    });
  }
}

export class TextArea extends SettingType<string> {
  minCharacter: number = 0;
  maxCharacter: number = 20000;
  constructor(props: {
    name: string;
    default?: string;
    required?: boolean;
    description?: string;
    minCharacter?: number;
    maxCharacter?: number;
  }) {
    super({
      type: 'textArea',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? '',
      description: props.description,
    });
    if (props?.minCharacter) this.minCharacter = props.minCharacter;
    if (props?.maxCharacter) this.maxCharacter = props.maxCharacter;
  }
}

export class SecretPicker extends SettingType<string> {
  constructor(props: { name: string; default?: string; required?: boolean; description?: string }) {
    super({
      type: 'secretPicker',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? '',
      description: props.description,
    });
  }
}

export class ImageUpload extends SettingType<string> {
  constructor(props: { name: string; default?: string; required?: boolean; description?: string }) {
    super({
      type: 'imageUpload',
      name: props.name,
      required: props?.required ?? false,
      default: props?.default ?? '',
      description: props.description,
    });
  }
}
