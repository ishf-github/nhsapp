import { redirect } from '@sveltejs/kit'
import { supabase } from '../../../supabaseClient.js'

export const GET = async (event) => {
  const { url } = event
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')
  console.log(`token_hash: ${token_hash}, type: ${type}`)

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      console.error('Error verifying OTP:', error)
    } else {
      console.log('OTP verification successful:', data)
  
      const { user, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error getting user:', userError)
        throw redirect(303, '/auth/auth-code-error')
      }

      const { data: clinician, error: clinicianError } = await supabase
        .from('clinicians')
        .select('clinician_id')
        .eq('clinician_id', user.id)
        .single()

      if (clinicianError) {
        console.error('Error getting clinician:', clinicianError)
        throw redirect(303, '/patient-signin')
      }

      if (clinician) {
        console.log('Redirecting to clinician sign-in')
        throw redirect(303, '/clinician-signin')
      } else {
        console.log('Redirecting to patient sign-in')
        throw redirect(303, '/patient-signin')
      }
    }
  } else {
    console.log('Missing token_hash or type in URL')
  }

  throw redirect(303, '/auth/auth-code-error')
}
