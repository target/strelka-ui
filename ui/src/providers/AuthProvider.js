import Authentication from './Authentication'
import AuthContext from '../contexts/auth'

const AuthenticationProvider = ({ children, ...props }) => {
  return (
    <Authentication {...props}>
      {(api) => (
        <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
      )}
    </Authentication>
  )
}

export default AuthenticationProvider