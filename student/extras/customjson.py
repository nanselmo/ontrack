from django.core.serializers.json import Serializer as Builtin_Serializer


class MetalessSerialiser(Serializer):
    def end_object( self, obj ):
        self._current['test'] = obj._get_pk_val()
        self.objects.append( self._current )
