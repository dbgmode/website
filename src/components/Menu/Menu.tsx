import {Command} from 'cmdk';

const Menu = ({hidden, id}) => (
  <Command label='Navigation Menu' hidden={true} id={'menu'}>
    <div cmdk-header=''>
      <span className='logomark'>
        dbgmo<span className='dot'>.</span>de/
      </span>
      <Command.Input placeholder='type here or select below' autoFocus={true} />
    </div>
    <hr className='ainbow' style={{filter: 'brightness(0.65)'}} />
    <Command.List>
      <Command.Empty>No results found.</Command.Empty>

      <Command.Group heading='Letters'>
        <Command.Item>a</Command.Item>
        <Command.Item>b</Command.Item>
        <Command.Separator />
        <Command.Item>c</Command.Item>
      </Command.Group>

      <Command.Item>Apple</Command.Item>
    </Command.List>
  </Command>
);

export default Menu;
