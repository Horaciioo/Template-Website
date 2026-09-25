import { HONEYPOT_FIELD, HONEYPOT_LABEL } from '@/declarations/http'
import { FIELD_STYLES } from '@/declarations/ui/variants'

/**
 * Anti-robot field
 * @return {JSX.Element} - Hidden field
 */

export const HoneypotField = () => (
  <div aria-hidden="true" className={FIELD_STYLES.trap}>
    <label>
      {HONEYPOT_LABEL}
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  </div>
)
