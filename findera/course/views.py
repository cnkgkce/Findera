from django.http import JsonResponse
from .models import Course
import json
from django.core import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import ahpy



def findDifferents(lst, prop):
    arr = []
    for e in lst.values():
        if not e[prop] in arr:
            arr.append(e[prop])

    if prop != 'difficulty':
        arr.sort()
    else:
        tp = ["Beginner", "Intermediate", "Mixed", "Advanced"]
        a = []
        for i in range(4):
            if tp[i] in arr:
                a.append(tp[i])
        return a
    return arr



# data for provide selections
def hello_world(request):

    courses = Course.objects.all()
    obj = json.loads(request.body.decode("utf-8"))

    for key,value in obj.items():
        if key == "price_rating":
            break
        mapping = {key : value}  #buraya if yazılcak price number of students ve rating icin cunku buralardan aralık gelecek

        if value != 'all' and (key == 'category' or key == 'difficulty' or key == 'publish_year') :
            courses = courses.filter(**mapping)

    optionalCategory = findDifferents(courses,"category")
    optionalPublish_year = findDifferents(courses,"publish_year")
    optionalDifficulty = findDifferents(courses,"difficulty")
    courses_serialized = serializers.serialize('json', courses)

    return JsonResponse({
        "courses": courses_serialized,
        "optionalCategory": optionalCategory,
        "optionalPublish_year":optionalPublish_year,
        "optionalDifficulty":optionalDifficulty,
    }, safe=False)





# filtered data
def getData(request):

    courses = Course.objects.all()
    obj = json.loads(request.body.decode("utf-8"))


    for key,value in obj.items():
        if key == "price_rating":
            break
        mapping = {key : value}  #buraya if yazılcak price number of students ve rating icin cunku buralardan aralık gelecek
        if key == 'price' and value != 'all':
            starr = value.split('_')

            mapping = {"price__gte": int(starr[0])}
            courses = courses.filter(**mapping)
            mapping = {"price__lte": int(starr[1])}

            courses = courses.filter(**mapping)
            continue
        if key == 'rating' and value != 'all':
            mapping = {"rating__gt": int(value)}

            courses = courses.filter(**mapping)
            continue
        if key == 'duration' and value != 'all':
            starr = value.split('_')

            mapping = {"duration__gte": int(starr[0])}
            courses = courses.filter(**mapping)
            mapping = {"duration__lte": int(starr[1])}

            courses = courses.filter(**mapping)
            continue

        if(value != 'all'):
            courses = courses.filter(**mapping)

    response = []
    for course in courses.values():
        response.append({**course})


    # ahp hesabı burada olacak

    print("OBJECT ! ",obj)
    
    variable_comparisons = {
        ('price', 'rating'): float(obj["price_rating"]),
        ('price', 'numberofstudents'): float(obj["price_numberofstudents"]),
        ('price','duration') : float(obj['price_duration']),
        ('rating', 'numberofstudents'): float(obj["rating_numberofstudents"]),
        ('rating', 'duration') : float(obj['rating_duration']),
        ('numberofstudents', 'duration') : float(obj['numberofstudents_duration'])
    }

    variables = ahpy.Compare(name='Variables', comparisons=variable_comparisons, precision=9, random_index='saaty')
    print("weights", variables.target_weights)
    print("consistency_ratio", variables.consistency_ratio)
    if variables.consistency_ratio < 0.01:
        print("Consistent!")
        sump = 0
        sumr = 0
        sumns = 0
        sumd = 0
        for course in response:
            if int(course["price"]) == 0:
                sump += 1
            else:
                sump += 1/float(course["price"])
            
            if int(course["duration"]) == 0:
                sumd += 1
            else:
                sumd += 1/float(course["duration"])
                
            sumr += float(course["rating"])
            sumns += int(course["enrolled_students"])
        
        ahp_list = []
        for course in response:
            cur = 0
            if int(course["price"]) == 0:
                cur += variables.target_weights["price"] / sump #new
            else:
                cur +=  variables.target_weights["price"]/float(course["price"]) / sump

            if int(course["duration"]) == 0:
                cur += variables.target_weights["duration"] / sumd  # new
            else:
                cur += variables.target_weights["duration"]/float(course["duration"]) / sumd
            
            cur += float(course["rating"]) * variables.target_weights["rating"] / sumr 
            cur += float(course["enrolled_students"]) * variables.target_weights["numberofstudents"] / sumns
            ahp_list.append(tuple([cur, course]))
        
        ahp_list.sort(key=lambda i: i[0], reverse=True)
        response = []
        for el in ahp_list:
            print(el[0])
            response.append(el[1])

    return JsonResponse({
        "courses": response, "ahp": variables.consistency_ratio
    })

#admin2 admin2 kaydoldu
def sign_up(request):
    obj = json.loads(request.body.decode("utf-8"))
    user = User.objects.create_user(username = obj["username"], password = obj["password"])
    user.save()
    print("SIGN UP!__________________")
    return JsonResponse({"success" : True})

def log_in(request):
    obj = json.loads(request.body.decode("utf-8"))
    user = authenticate(username = obj["username"],password  =obj["password"])
    if user is not None:
        # A backend authenticated the credentials
        print("Login!")
        return JsonResponse({"success": True})
    else:
        # No backend authenticated the credentials
        print("cannot Login!")
        return JsonResponse({"success": False})

