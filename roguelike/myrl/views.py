# adapted to my own app from the tutorials at http://www.twithdjango.com
from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from myrl.forms import UserForm, UserProfileForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from models import UserProfile

@login_required
def save_code(request):
    #context = RequestContext(request):
    code = request.GET['code']
    user = request.user
    profile = UserProfile.objects.get(user=user)
    profile.code = code
    profile.save()
    return HttpResponse()

def test(request):
    return render_to_response('test.html')

@login_required
def index(request):
    context = RequestContext(request)
    user = request.user
    profile = UserProfile.objects.get(user=user)
    theCode = profile.code
    context_dict = {'boldmessage': "I am bold font from the context", 'theCode':theCode}
    return render_to_response('index.html', context_dict, context)


def register(request):
    # Like before, get the request's context.
    context = RequestContext(request)

    registered = request.user.is_authenticated()

    # If it's a HTTP POST, we're interested in processing form data.
    if request.method == 'POST':
        # Attempt to grab information from the raw form information.
        # Note that we make use of both UserForm and UserProfileForm.
        user_form = UserForm(data=request.POST)
        profile_form = UserProfileForm(data=request.POST)

        # If the two forms are valid...
        if user_form.is_valid() and profile_form.is_valid():
            # Save the user's form data to the database.
            user = user_form.save()

            # Now we hash the password with the set_password method.
            # Once hashed, we can update the user object.
            user.set_password(user.password)
            user.save()

            # Now sort out the UserProfile instance.
            # Since we need to set the user attribute ourselves, we set commit=False.
            # This delays saving the model until we're ready to avoid integrity problems.
            profile = profile_form.save(commit=False)
            profile.user = user

            # Did the user provide a profile picture?
            # If so, we need to get it from the input form and put it in the UserProfile model.
            if 'picture' in request.FILES:
                profile.picture = request.FILES['picture']

            # Now we save the UserProfile model instance.
            profile.save()
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            login(request, user)
            return HttpResponseRedirect('/play/')

        # Invalid form or forms - mistakes or something else?
        # Print problems to the terminal.
        # They'll also be shown to the user.
        else:
            print user_form.errors, profile_form.errors

    # Not a HTTP POST, so we render our form using two ModelForm instances.
    # These forms will be blank, ready for user input.
    else:
        user_form = UserForm()
        profile_form = UserProfileForm()

    # Render the template depending on the context.
    return render_to_response(
            'register.html',
            {'user_form': user_form, 'profile_form': profile_form, 'registered': registered},
            context)

@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect("/")

def user_login(request):
    # Like before, obtain the context for the user's request.
    context = RequestContext(request)
    print "hi"

    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
	print "great"
        # Gather the username and password provided by the user.
        # This information is obtained from the login form.
        username = request.POST['username']
        password = request.POST['password']

        # Use Django's machinery to attempt to see if the username/password
        # combination is valid - a User object is returned if it is.
        user = authenticate(username=username, password=password)

        # If we have a User object, the details are correct.
        # If None (Python's way of representing the absence of a value), no user
        # with matching credentials was found.
        if user is not None:
            # Is the account active? It could have been disabled.
            if user.is_active:
                # If the account is valid and active, we can log the user in.
                # We'll send the user back to the homepage.
                login(request, user)
                return HttpResponseRedirect('/play/')
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Your myrl account is disabled.")
        else:
            # Bad login details were provided. So we can't log the user in.
            print "Invalid login details: {0}, {1}".format(username, password)
            return HttpResponse("Invalid login details supplied.")

    # The request is not a HTTP POST, so display the login form.
    # This scenario would most likely be a HTTP GET.
    else:
        # No context variables to pass to the template system, hence the
        # blank dictionary object...
        return render_to_response('welcome.html', {}, context)


