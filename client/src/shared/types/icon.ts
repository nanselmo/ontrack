export interface IconProps {
  width?: string 
  height?: string
  style?: {
    [rule: string]: string
  }
}

export type IconComponent = (props: IconProps) => IconElement;

export type IconElement = React.ReactElement<SVGElement>


