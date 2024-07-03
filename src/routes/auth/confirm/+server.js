import { redirect } from '@sveltejs/kit'
import { supabase } from '../../../supabaseClient.js'

// Verification
export const GET = async (event) => {
  // Extract URL token_hash and type from event object
  const { url } = event
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')

  // Check if token_hash and type are present in the URL
  if (token_hash && type) {
    // Verify the OTP using Supabase's verifyOtp method
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      // Handle error if OTP verification fails
      throw redirect(303, '/auth/auth-code-error')
    } else {
      // Get the current authenticated user
      const { user, error: userError } = await supabase.auth.getUser()
      if (userError) {
        // Handle error if getting user fails
        throw redirect(303, '/auth/auth-code-error')
      }

      // Check if user is a clinician by querying 'clinicians' table
      const { data: clinician, error: clinicianError } = await supabase
        .from('clinicians')
        .select('clinician_id')
        .eq('clinician_id', user.id)
        .single()

      if (clinicianError) {
        // Redirect if querying 'clinicians' table fails
        throw redirect(303, '/patient-signin')
      }

      // Redirect to clinician sign-in page if the user is a clinician
      if (clinician) {
        throw redirect(303, '/clinician-signin')
      } else {
        // Redirect to patient sign-in page if the user is not a clinician
        throw redirect(303, '/patient-signin')
      }
    }
  } else {
    // Handle case if token_hash or type is missing in the URL
    throw redirect(303, '/auth/auth-code-error')
  }
}
