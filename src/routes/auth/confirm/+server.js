// @ts-nocheck
import { redirect } from '@sveltejs/kit'
import { supabase } from '../../../supabaseClient.js'

export const GET = async (event) => {
  const {
    url,
    // locals: { supabase },
  } = event
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')
//   const next = url.searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
        //supabase.auth.getuser - find information as to whether the user is a provider or a patient
    //   if provider is true
      
        throw redirect(303, '/providerSignIn')
    // else if provider is false
        // throw redirect(303, '/patientSignIn')
    }
  }

  // return the user to an error page with some instructions
  throw redirect(303, '/auth/auth-code-error')
}