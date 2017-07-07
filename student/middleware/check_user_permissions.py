from django.http import (HttpResponseRedirect, Http404)
from django.utils.deprecation import MiddlewareMixin
from student.ontrack import get_user_info
# from student.models import User, etc

# debug
import sys

class CheckUserPermissions(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):

        # prevent middleware from blocking admin view
        # FIXME: hacky
        if request.path.startswith('/admin/'):
            view_kwargs.pop("allow", None)
            view_kwargs.pop("logon_required", None)
            return None

        # if requestor is not logged in, send them to the login page
        logon_required = view_kwargs.get("logon_required")
        if logon_required and not request.user.is_authenticated():
            print >>sys.stdout, "Not logged in"
            view_kwargs.pop("allow", None)
            view_kwargs.pop("logon_required", None)
            return HttpResponseRedirect("/logon")

        elif logon_required == False:
            view_kwargs.pop("allow", None)
            view_kwargs.pop("logon_required", None)
            return None
        
        try:
            user_id, user_type = get_user_info(request)
        except ValueError:
            print >>sys.stdout, "User not found"
            # user not found
            return HttpResponseRedirect("/logon")

        print >>sys.stdout, "{0}: User type: {1} User id {2}".format(request.path, user_type, user_id)

        user_group_permissions_table = view_kwargs.get("allow")
        if user_group_permissions_table is None:
            print >>sys.stdout, "CheckUserPermissions: No permissions set"
            raise Http404
        
        user_permissions_function = user_group_permissions_table.get(user_type)
        if user_permissions_function is None:
            print >>sys.stdout, "CheckUserPermissions: No permissions function"
            raise Http404

        can_access = user_permissions_function(user_id, user_type, request, view_func, view_args, view_kwargs)

        if can_access:
            # strip the 'allow' and 'logon_required' field from view_kwargs
            view_kwargs.pop("allow", None)
            view_kwargs.pop("logon_required", None)
            # allow the request to go through
            return None

        # if something got past, send a 404
        raise Http404

        
            
