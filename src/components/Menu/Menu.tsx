import {Command} from 'cmdk';

const Menu = ({hidden, id}) => (
  <Command label='Navigation Menu' hidden={true} id={'menu'}>
    <div cmdk-header=''>
      <Command.Input
        placeholder='type here or select below'
        minLength={20}
        tabIndex={1}
      />
      <span className='logomark' tabIndex={-1} hidden={true}>
        dbgmo<span className='dot'>.</span>de/
      </span>
    </div>
    <hr />
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
