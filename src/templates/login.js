import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
        const surface = new AnchorsPane();
        {
            surface.element.style.width = '300px';
            surface.element.style.height = '400px';
        }
        this.surface = surface;
        const registerByEmail = new Button();
        {
            registerByEmail.text = 'E-Mail';
            registerByEmail.element.style.left = '60px';
            registerByEmail.element.style.width = '181px';
            registerByEmail.element.style.top = '250px';
            registerByEmail.element.style.height = '41px';
        }
        this.registerByEmail = registerByEmail;
        const logo = new Label();
        {
            logo.text = 'Logo';
            logo.horizontalTextPosition = 'center';
            logo.element.style.left = '60px';
            logo.element.style.width = '177px';
            logo.element.style.top = '40px';
            logo.element.style.height = '118px';
        }
        this.logo = logo;
        const continueWithFacebook = new Button();
        {
            continueWithFacebook.text = 'Facebook';
            continueWithFacebook.element.style.left = '60px';
            continueWithFacebook.element.style.width = '181px';
            continueWithFacebook.element.style.top = '190px';
            continueWithFacebook.element.style.height = '41px';
        }
        this.continueWithFacebook = continueWithFacebook;
        const alreadyRegistered = new Label();
        {
            alreadyRegistered.text = 'Already registered ?';
            alreadyRegistered.element.style.left = '60px';
            alreadyRegistered.element.style.top = '310px';
            alreadyRegistered.element.style.height = '20px';
        }
        this.alreadyRegistered = alreadyRegistered;
        const signIn = new Label();
        {
            signIn.text = 'Sign in here';
            signIn.element.style.left = '60px';
            signIn.element.style.top = '340px';
            signIn.element.style.height = '20px';
        }
        this.signIn = signIn;
        surface.add(logo);
        surface.add(continueWithFacebook);
        surface.add(registerByEmail);
        surface.add(alreadyRegistered);
        surface.add(signIn);
    }
}
export default KengaWidgets;