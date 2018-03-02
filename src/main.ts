import ConsoleSystem from './Console/ConsoleSystem'
import programs from './Programs'
import './Common/DateTime'
import './style'

new ConsoleSystem('#app')
    .boot(programs);