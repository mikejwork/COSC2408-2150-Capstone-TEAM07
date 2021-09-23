import React from 'react'
import styles from '../../css/Legal/Legal.module.css';

function PrivacyPolicy(props) {
  return (
    <div className={`${props.padding ? styles.agreementPage : ""}`}>
      <h2 className="heading">Privacy Policy</h2>
      <p>
        Cryptalk is committed to providing quality services to you and this policy outlines our ongoing obligations to you in respect of how we manage your Personal Information.
        We have adopted the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) (the Privacy Act). The NPPs govern the way in which we collect, use, disclose, store, secure and dispose of your Personal Information.
        A copy of the Australian Privacy Principles may be obtained from the website of The Office of the Australian Information Commissioner at www.aoic.gov.au
      </p>
      <hr/>

      <h3 className="subheading">What is Personal Information and why do we collect it?</h3>
      <p>
        Personal Information is information or an opinion that identifies an individual. Examples of Personal Information we collect include: names, addresses, email addresses, phone and facsimile numbers.
        This Personal Information is obtained in many ways including by email, via our website www.capstone-cryptalk.com, from imported media, and from third parties. We don’t guarantee website links or policy of authorised third parties.
        We collect your Personal Information for the primary purpose of providing our services to you, providing information to our clients and marketing. We may also use your Personal Information for secondary purposes closely related to the primary purpose, in circumstances where you would reasonably expect such use or disclosure. You may unsubscribe from our mailing/marketing lists at any time by contacting us in writing.
        When we collect Personal Information we will, where appropriate and where possible, explain to you why we are collecting the information and how we plan to use it.
      </p>
      <hr/>

      <h3 className="subheading">Sensitive Information</h3>
      <p>
        Sensitive information is defined in the Privacy Act to include information or opinion about such things as an individual's racial or ethnic origin, political opinions, membership of a political association, religious or philosophical beliefs, membership of a trade union or other professional body, criminal record or health information.
        <br/>
        <u>Sensitive information will be used by us only:</u>
        <ul>
          <li>- For the primary purpose for which it was obtained</li>
          <li>- For a secondary purpose that is directly related to the primary purpose</li>
          <li>- With your consent; or where required or authorised by law.</li>
        </ul>
      </p>
      <hr/>

      <h3 className="subheading">Third Parties</h3>
      <p>Where reasonable and practicable to do so, we will collect your Personal Information only from you. However, in some circumstances we may be provided with information by third parties. In such a case we will take reasonable steps to ensure that you are made aware of the information provided to us by the third party.</p>
      <hr/>

      <h3 className="subheading">Disclosure of Personal Information</h3>
      <p>
        Your Personal Information may be disclosed in a number of circumstances including the following:
        <ul>
          <li>-	Third parties where you consent to the use or disclosure; and</li>
          <li>-	Where required or authorised by law.</li>
        </ul>
      </p>
      <hr/>

      <h3 className="subheading">Security of Personal Information</h3>
      <p>
        Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from unauthorized access, modification or disclosure.
        <br />When your Personal Information is no longer needed for the purpose for which it was obtained, we will take reasonable steps to destroy or permanently de-identify your Personal Information. However, most of the Personal Information is or will be stored in client files which will be kept by us for a minimum of 7 years.
      </p>
      <hr/>

      <h3 className="subheading">Access to your Personal Information</h3>
      <p>
        You may access the Personal Information we hold about you and to update and/or correct it, subject to certain exceptions. If you wish to access your Personal Information, please contact us in writing.
        <br /> Cryptalk will not charge any fee for your access request, but may charge an administrative fee for providing a copy of your Personal Information.
        <br />In order to protect your Personal Information we may require identification from you before releasing the requested information.
      </p>
      <hr/>

      <h3 className="subheading">Maintaining the Quality of your Personal Information</h3>
      <p>
        It is an important to us that your Personal Information is up to date. We  will  take reasonable steps to make sure that your Personal Information is accurate, complete and up-to-date. If you find that the information we have is not up to date or is inaccurate, please advise us as soon as practicable so we can update our records and ensure we can continue to provide quality services to you.
      </p>
      <hr/>

      <h3 className="subheading">Policy Updates</h3>
      <p>
        This Policy may change from time to time and is available on our website.
      </p>
      <hr/>

      <h3 className="subheading">Privacy Policy Complaints and Enquiries</h3>
      <p>
        If you have any queries or complaints about our Privacy Policy please contact us at:
      </p>
      <h5 className="subcomment">EMAIL: s3787174@student.rmit.edu.au</h5>
      <h5 className="subcomment">ADDRESS: 124 La Trobe St</h5>
      <h5 className="subcomment">Effective Date: 23rd day of August, 2021</h5>
      <h5 className="subcomment">© 2002-2021 LawDepot.com ®</h5>
    </div>
  )
}

export default PrivacyPolicy
