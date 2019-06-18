import test from '@interactjs/_dev/test/test';
import Eventable from '@interactjs/core/Eventable';
import Interaction from '@interactjs/core/Interaction';
import * as helpers from '@interactjs/core/tests/_helpers';
import pointerEvents from './base';
import interactableTargets from './interactableTargets';
test('pointerEvents.types', (t) => {
    t.deepEqual(pointerEvents.types, [
        'down',
        'move',
        'up',
        'cancel',
        'tap',
        'doubletap',
        'hold',
    ], 'pointerEvents.types is as expected');
    t.end();
});
test('pointerEvents.fire', (t) => {
    const scope = helpers.mockScope();
    const eventable = new Eventable(pointerEvents.defaults);
    const type = 'TEST';
    const element = {};
    const eventTarget = {};
    const TEST_PROP = ['TEST_PROP'];
    let firedEvent;
    const targets = [{
            eventable,
            node: element,
            props: {
                TEST_PROP,
            },
        }];
    eventable.on(type, (event) => { firedEvent = event; });
    pointerEvents.fire({
        type,
        eventTarget,
        pointer: {},
        event: {},
        interaction: {},
        targets,
    }, scope);
    t.ok(firedEvent instanceof pointerEvents.PointerEvent, 'Fired event is an instance of pointerEvents.PointerEvent');
    t.equal(firedEvent.type, type, 'Fired event type is correct');
    t.equal(firedEvent.currentTarget, element, 'Fired event currentTarget is correct');
    t.equal(firedEvent.target, eventTarget, 'Fired event target is correct');
    t.equal(firedEvent.TEST_PROP, TEST_PROP, 'Fired event has props from target.props');
    const tapTime = 500;
    const interaction = Object.assign(scope.interactions.new({}), { tapTime: -1, prevTap: null });
    interaction.updatePointer({}, {}, null);
    const tapEvent = Object.assign(new pointerEvents.PointerEvent('tap', {}, {}, null, interaction, 0), {
        timeStamp: tapTime,
    });
    pointerEvents.fire({
        pointerEvent: tapEvent,
        interaction,
        targets: [{
                eventable,
                element,
            }],
    }, scope);
    t.equal(interaction.tapTime, tapTime, 'interaction.tapTime is updated');
    t.equal(interaction.prevTap, tapEvent, 'interaction.prevTap is updated');
    t.end();
});
test('pointerEvents.collectEventTargets', (t) => {
    const type = 'TEST';
    const TEST_PROP = ['TEST_PROP'];
    const target = {
        node: {},
        props: { TEST_PROP },
        eventable: new Eventable(pointerEvents.defaults),
    };
    let collectedTargets;
    function onCollect({ targets }) {
        targets.push(target);
        collectedTargets = targets;
    }
    pointerEvents.signals.on('collect-targets', onCollect);
    pointerEvents.collectEventTargets({
        interaction: new Interaction({ signals: helpers.mockSignals() }),
        pointer: {},
        event: {},
        eventTarget: {},
        type,
    });
    t.deepEqual(collectedTargets, [target]);
    pointerEvents.signals.off('collect-targets', onCollect);
    t.end();
});
test('pointerEvents Interaction update-pointer signal', (t) => {
    const scope = helpers.mockScope();
    scope.usePlugin(pointerEvents);
    const interaction = scope.interactions.new({});
    const initialHold = { duration: Infinity, timeout: null };
    const event = {};
    interaction.updatePointer(helpers.newPointer(0), event, null, false);
    t.deepEqual(interaction.pointers.map((p) => p.hold), [initialHold], 'set hold info for move on new pointer');
    interaction.removePointer(helpers.newPointer(0), event);
    interaction.updatePointer(helpers.newPointer(0), event, null, true);
    t.deepEqual(interaction.pointers.map((p) => p.hold), [initialHold]);
    interaction.updatePointer(helpers.newPointer(5), event, null, true);
    t.deepEqual(interaction.pointers.map((p) => p.hold), [initialHold, initialHold]);
    t.end();
});
test('pointerEvents Interaction remove-pointer signal', (t) => {
    const scope = helpers.mockScope();
    scope.usePlugin(pointerEvents);
    const interaction = scope.interactions.new({});
    const ids = [0, 1, 2, 3];
    const removals = [
        { id: 0, remain: [1, 2, 3], message: 'first of 4' },
        { id: 2, remain: [1, 3], message: 'middle of 3' },
        { id: 3, remain: [1], message: 'last of 2' },
        { id: 1, remain: [], message: 'final' },
    ];
    for (const id of ids) {
        const index = interaction.updatePointer({ pointerId: id }, {}, null, true);
        // use the ids as the pointerInfo.hold value for this test
        interaction.pointers[index].hold = id;
    }
    for (const removal of removals) {
        interaction.removePointer({ pointerId: removal.id }, null);
        t.deepEqual(interaction.pointers.map((p) => p.hold), removal.remain, `${removal.message} - remaining interaction.holdTimers is correct`);
    }
    t.end();
});
test('pointerEvents down hold up tap', async (t) => {
    const { interaction, event, interactable, } = helpers.testEnv({ plugins: [pointerEvents, interactableTargets] });
    const fired = [];
    for (const type of pointerEvents.types) {
        interactable.on(type, (e) => fired.push(e));
    }
    interaction.pointerDown(event, event, event.target);
    interaction.pointerMove(event, event, event.target);
    t.deepEqual(fired.map((e) => e.type), ['down'], 'duplicate move event is not fired');
    const holdTimer = interaction.pointers[0].hold;
    t.ok(!!holdTimer.timeout, 'hold timeout is set');
    await helpers.timeout(holdTimer.duration);
    interaction.pointerUp(event, event, event.target, event.target);
    t.deepEqual(fired.map((e) => e.type), ['down', 'hold', 'up', 'tap'], 'tap event is fired after down, hold and up events');
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLDRCQUE0QixDQUFBO0FBQzdDLE9BQU8sU0FBUyxNQUFNLDRCQUE0QixDQUFBO0FBQ2xELE9BQU8sV0FBVyxNQUFNLDhCQUE4QixDQUFBO0FBQ3RELE9BQU8sS0FBSyxPQUFPLE1BQU0saUNBQWlDLENBQUE7QUFDMUQsT0FBTyxhQUFrQyxNQUFNLFFBQVEsQ0FBQTtBQUN2RCxPQUFPLG1CQUFtQixNQUFNLHVCQUF1QixDQUFBO0FBRXZELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ2hDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssRUFDN0I7UUFDRSxNQUFNO1FBQ04sTUFBTTtRQUNOLElBQUk7UUFDSixRQUFRO1FBQ1IsS0FBSztRQUNMLFdBQVc7UUFDWCxNQUFNO0tBQ1AsRUFDRCxvQ0FBb0MsQ0FBQyxDQUFBO0lBRXZDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNULENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDL0IsTUFBTSxLQUFLLEdBQW1CLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUVqRCxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDdkQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFBO0lBQ25CLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQTtJQUNsQixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUE7SUFDdEIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUMvQixJQUFJLFVBQVUsQ0FBQTtJQUNkLE1BQU0sT0FBTyxHQUFvQixDQUFDO1lBQ2hDLFNBQVM7WUFDVCxJ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Q0FBQyxDQUFBO0lBRXpDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUUvRCxDQUFDLENBQUMsU0FBUyxDQUNULEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDeEIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFDN0IsbURBQW1ELENBQUMsQ0FBQTtJQUV0RCxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ0BpbnRlcmFjdGpzL19kZXYvdGVzdC90ZXN0J1xuaW1wb3J0IEV2ZW50YWJsZSBmcm9tICdAaW50ZXJhY3Rqcy9jb3JlL0V2ZW50YWJsZSdcbmltcG9ydCBJbnRlcmFjdGlvbiBmcm9tICdAaW50ZXJhY3Rqcy9jb3JlL0ludGVyYWN0aW9uJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICdAaW50ZXJhY3Rqcy9jb3JlL3Rlc3RzL19oZWxwZXJzJ1xuaW1wb3J0IHBvaW50ZXJFdmVudHMsIHsgRXZlbnRUYXJnZXRMaXN0IH0gZnJvbSAnLi9iYXNlJ1xuaW1wb3J0IGludGVyYWN0YWJsZVRhcmdldHMgZnJvbSAnLi9pbnRlcmFjdGFibGVUYXJnZXRzJ1xuXG50ZXN0KCdwb2ludGVyRXZlbnRzLnR5cGVzJywgKHQpID0+IHtcbiAgdC5kZWVwRXF1YWwocG9pbnRlckV2ZW50cy50eXBlcyxcbiAgICBbXG4gICAgICAnZG93bicsXG4gICAgICAnbW92ZScsXG4gICAgICAndXAnLFxuICAgICAgJ2NhbmNlbCcsXG4gICAgICAndGFwJyxcbiAgICAgICdkb3VibGV0YXAnLFxuICAgICAgJ2hvbGQnLFxuICAgIF0sXG4gICAgJ3BvaW50ZXJFdmVudHMudHlwZXMgaXMgYXMgZXhwZWN0ZWQnKVxuXG4gIHQuZW5kKClcbn0pXG5cbnRlc3QoJ3BvaW50ZXJFdmVudHMuZmlyZScsICh0KSA9PiB7XG4gIGNvbnN0IHNjb3BlOiBJbnRlcmFjdC5TY29wZSA9IGhlbHBlcnMubW9ja1Njb3BlKClcblxuICBjb25zdCBldmVudGFibGUgPSBuZXcgRXZlbnRhYmxlKHBvaW50ZXJFdmVudHMuZGVmYXVsdHMpXG4gIGNvbnN0IHR5cGUgPSAnVEVTVCdcbiAgY29uc3QgZWxlbWVudCA9IHt9XG4gIGNvbnN0IGV2ZW50VGFyZ2V0ID0ge31cbiAgY29uc3QgVEVTVF9QUk9QID0gWydURVNUX1BST1AnXVxuICBsZXQgZmlyZWRFdmVudFxuICBjb25zdCB0YXJnZXRzOiBFdmVudFRhcmdldExpc3QgPSBbe1xuICAgIGV2ZW50YWJsZSxcbiAgICBub2RlOiBlbGVtZW50IGFzIE5vZGUsXG4gICAgcHJvcHM6IHtcbiAgICAgIFRFU1RfUFJPUCxcbiAgICB9LFxuICB9XVxuXG4gIGV2ZW50YWJsZS5vbih0eXBlLCAoZXZlbnQpID0+IHsgZmlyZWRFdmVudCA9IGV2ZW50IH0pXG5cbiAgcG9pbnRlckV2ZW50cy5maXJlKHtcbiAgICB0eXBlLFxuICAgIGV2ZW50VGFyZ2V0LFxuICAgIHBvaW50ZXI6IHt9LFxuICAgIGV2ZW50OiB7fSxcbiAgICBpbnRlcmFjdGlvbjoge30sXG4gICAgdGFyZ2V0cyxcbiAgfSBhcyBhbnksIHNjb3BlKVxuXG4gIHQub2soZmlyZWRFdmVudCBpbnN0YW5jZW9mIHBvaW50ZXJFdmVudHMuUG9pbnRlckV2ZW50LFxuICAgICdGaXJlZCBldmVudCBpcyBhbiBpbnN0YW5jZSBvZiBwb2ludGVyRXZlbnRzLlBvaW50ZXJFdmVudCcpXG4gIHQuZXF1YWwoZmlyZWRFdmVudC50eXBlLCB0eXBlLFxuICAgICdGaXJlZCBldmVudCB0eXBlIGlzIGNvcnJlY3QnKVxuICB0LmVxdWFsKGZpcmVkRXZlbnQuY3VycmVudFRhcmdldCwgZWxlbWVudCxcbiAgICAnRmlyZWQgZXZlbnQgY3VycmVudFRhcmdldCBpcyBjb3JyZWN0JylcbiAgdC5lcXVhbChmaXJlZEV2ZW50LnRhcmdldCwgZXZlbnRUYXJnZXQsXG4gICAgJ0ZpcmVkIGV2ZW50IHRhcmdldCBpcyBjb3JyZWN0JylcbiAgdC5lcXVhbChmaXJlZEV2ZW50LlRFU1RfUFJPUCwgVEVTVF9QUk9QLFxuICAgICdGaXJlZCBldmVudCBoYXMgcHJvcHMgZnJvbSB0YXJnZXQucHJvcHMnKVxuXG4gIGNvbnN0IHRhcFRpbWUgPSA1MDBcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBPYmplY3QuYXNzaWduKFxuICAgIHNjb3BlLmludGVyYWN0aW9ucy5uZXcoe30pLFxuICAgIHsgdGFwVGltZTogLTEsIHByZXZUYXA6IG51bGwgfSlcblxuICBpbnRlcmFjdGlvbi51cGRhdGVQb2ludGVyKHt9IGFzIGFueSwge30gYXMgYW55LCBudWxsKVxuXG4gIGNvbnN0IHRhcEV2ZW50ID0gT2JqZWN0LmFzc2lnbihuZXcgcG9pbnRlckV2ZW50cy5Qb2ludGVyRXZlbnQoJ3RhcCcsIHt9IGFzIGFueSwge30gYXMgYW55LCBudWxsLCBpbnRlcmFjdGlvbiwgMCksIHtcbiAgICB0aW1lU3RhbXA6IHRhcFRpbWUsXG4gIH0pXG5cbiAgcG9pbnRlckV2ZW50cy5maXJlKHtcbiAgICBwb2ludGVyRXZlbnQ6IHRhcEV2ZW50LFxuICAgIGludGVyYWN0aW9uLFxuICAgIHRhcmdldHM6IFt7XG4gICAgICBldmVudGFibGUsXG4gICAgICBlbGVtZW50LFxuICAgIH1dLFxuICB9IGFzIGFueSwgc2NvcGUpXG5cbiAgdC5lcXVhbChpbnRlcmFjdGlvbi50YXBUaW1lLCB0YXBUaW1lLFxuICAgICdpbnRlcmFjdGlvbi50YXBUaW1lIGlzIHVwZGF0ZWQnKVxuICB0LmVxdWFsKGludGVyYWN0aW9uLnByZXZUYXAsIHRhcEV2ZW50LFxuICAgICdpbnRlcmFjdGlvbi5wcmV2VGFwIGlzIHVwZGF0ZWQnKVxuXG4gIHQuZW5kKClcbn0pXG5cbnRlc3QoJ3BvaW50ZXJFdmVudHMuY29sbGVjdEV2ZW50VGFyZ2V0cycsICh0KSA9PiB7XG4gIGNvbnN0IHR5cGUgPSAnVEVTVCdcbiAgY29uc3QgVEVTVF9QUk9QID0gWydURVNUX1BST1AnXVxuICBjb25zdCB0YXJnZXQgPSB7XG4gICAgbm9kZToge30gYXMgTm9kZSxcbiAgICBwcm9wczogeyBURVNUX1BST1AgfSxcbiAgICBldmVudGFibGU6IG5ldyBFdmVudGFibGUocG9pbnRlckV2ZW50cy5kZWZhdWx0cyksXG4gIH1cbiAgbGV0IGNvbGxlY3RlZFRhcmdldHNcblxuICBmdW5jdGlvbiBvbkNvbGxlY3QgKHsgdGFyZ2V0cyB9OiB7IHRhcmdldHM6IEV2ZW50VGFyZ2V0TGlzdCB9KSB7XG4gICAgdGFyZ2V0cy5wdXNoKHRhcmdldClcblxuICAgIGNvbGxlY3RlZFRhcmdldHMgPSB0YXJnZXRzXG4gIH1cblxuICBwb2ludGVyRXZlbnRzLnNpZ25hbHMub24oJ2NvbGxlY3QtdGFyZ2V0cycsIG9uQ29sbGVjdClcbiAgcG9pbnRlckV2ZW50cy5jb2xsZWN0RXZlbnRUYXJnZXRzKHtcbiAgICBpbnRlcmFjdGlvbjogbmV3IEludGVyYWN0aW9uKHsgc2lnbmFsczogaGVscGVycy5tb2NrU2lnbmFscygpIH0gYXMgYW55KSxcbiAgICBwb2ludGVyOiB7fSxcbiAgICBldmVudDoge30sXG4gICAgZXZlbnRUYXJnZXQ6IHt9LFxuICAgIHR5cGUsXG4gIH0gYXMgYW55KVxuXG4gIHQuZGVlcEVxdWFsKGNvbGxlY3RlZFRhcmdldHMsIFt0YXJnZXRdKVxuXG4gIHBvaW50ZXJFdmVudHMuc2lnbmFscy5vZmYoJ2NvbGxlY3QtdGFyZ2V0cycsIG9uQ29sbGVjdClcblxuICB0LmVuZCgpXG59KVxuXG50ZXN0KCdwb2ludGVyRXZlbnRzIEludGVyYWN0aW9uIHVwZGF0ZS1wb2ludGVyIHNpZ25hbCcsICh0KSA9PiB7XG4gIGNvbnN0IHNjb3BlOiBJbnRlcmFjdC5TY29wZSA9IGhlbHBlcnMubW9ja1Njb3BlKClcblxuICBzY29wZS51c2VQbHVnaW4ocG9pbnRlckV2ZW50cylcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IHNjb3BlLmludGVyYWN0aW9ucy5uZXcoe30pXG4gIGNvbnN0IGluaXRpYWxIb2xkID0geyBkdXJhdGlvbjogSW5maW5pdHksIHRpbWVvdXQ6IG51bGwgfVxuICBjb25zdCBldmVudCA9IHt9IGFzIEludGVyYWN0LlBvaW50ZXJFdmVudFR5cGVcblxuICBpbnRlcmFjdGlvbi51cGRhdGVQb2ludGVyKGhlbHBlcnMubmV3UG9pbnRlcigwKSwgZXZlbnQsIG51bGwsIGZhbHNlKVxuICB0LmRlZXBFcXVhbChpbnRlcmFjdGlvbi5wb2ludGVycy5tYXAoKHApID0+IHAuaG9sZCksIFtpbml0aWFsSG9sZF0sICdzZXQgaG9sZCBpbmZvIGZvciBtb3ZlIG9uIG5ldyBwb2ludGVyJylcblxuICBpbnRlcmFjdGlvbi5yZW1vdmVQb2ludGVyKGhlbHBlcnMubmV3UG9pbnRlcigwKSwgZXZlbnQpXG5cbiAgaW50ZXJhY3Rpb24udXBkYXRlUG9pbnRlcihoZWxwZXJzLm5ld1BvaW50ZXIoMCksIGV2ZW50LCBudWxsLCB0cnVlKVxuICB0LmRlZXBFcXVhbChpbnRlcmFjdGlvbi5wb2ludGVycy5tYXAoKHApID0+IHAuaG9sZCksIFtpbml0aWFsSG9sZF0pXG5cbiAgaW50ZXJhY3Rpb24udXBkYXRlUG9pbnRlcihoZWxwZXJzLm5ld1BvaW50ZXIoNSksIGV2ZW50LCBudWxsLCB0cnVlKVxuICB0LmRlZXBFcXVhbChpbnRlcmFjdGlvbi5wb2ludGVycy5tYXAoKHApID0+IHAuaG9sZCksIFtpbml0aWFsSG9sZCwgaW5pdGlhbEhvbGRdKVxuXG4gIHQuZW5kKClcbn0pXG5cbnRlc3QoJ3BvaW50ZXJFdmVudHMgSW50ZXJhY3Rpb24gcmVtb3ZlLXBvaW50ZXIgc2lnbmFsJywgKHQpID0+IHtcbiAgY29uc3Qgc2NvcGU6IEludGVyYWN0LlNjb3BlID0gaGVscGVycy5tb2NrU2NvcGUoKVxuXG4gIHNjb3BlLnVzZVBsdWdpbihwb2ludGVyRXZlbnRzKVxuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gc2NvcGUuaW50ZXJhY3Rpb25zLm5ldyh7fSlcblxuICBjb25zdCBpZHMgPSBbMCwgMSwgMiwgM11cbiAgY29uc3QgcmVtb3ZhbHMgPSBbXG4gICAgeyBpZDogMCwgcmVtYWluOiBbMSwgMiwgM10sIG1lc3NhZ2U6ICdmaXJzdCBvZiA0JyAgfSxcbiAgICB7IGlkOiAyLCByZW1haW46IFsxLCAgICAzXSwgbWVzc2FnZTogJ21pZGRsZSBvZiAzJyB9LFxuICAgIHsgaWQ6IDMsIHJlbWFpbjogWzEgICAgICBdLCBtZXNzYWdlOiAnbGFzdCBvZiAyJyAgIH0sXG4gICAgeyBpZDogMSwgcmVtYWluOiBbICAgICAgIF0sIG1lc3NhZ2U6ICdmaW5hbCcgICAgICAgfSxcbiAgXVxuXG4gIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgY29uc3QgaW5kZXggPSBpbnRlcmFjdGlvbi51cGRhdGVQb2ludGVyKHsgcG9pbnRlcklkOiBpZCB9IGFzIEludGVyYWN0LlBvaW50ZXJUeXBlLCB7fSBhcyBJbnRlcmFjdC5Qb2ludGVyRXZlbnRUeXBlLCBudWxsLCB0cnVlKVxuICAgIC8vIHVzZSB0aGUgaWRzIGFzIHRoZSBwb2ludGVySW5mby5ob2xkIHZhbHVlIGZvciB0aGlzIHRlc3RcbiAgICBpbnRlcmFjdGlvbi5wb2ludGVyc1tpbmRleF0uaG9sZCA9IGlkIGFzIGFueVxuICB9XG5cbiAgZm9yIChjb25zdCByZW1vdmFsIG9mIHJlbW92YWxzKSB7XG4gICAgaW50ZXJhY3Rpb24ucmVtb3ZlUG9pbnRlcih7IHBvaW50ZXJJZDogcmVtb3ZhbC5pZCB9IGFzIGFueSwgbnVsbClcblxuICAgIHQuZGVlcEVxdWFsKGludGVyYWN0aW9uLnBvaW50ZXJzLm1hcCgocCkgPT4gcC5ob2xkIGFzIHVua25vd24gYXMgbnVtYmVyKSwgcmVtb3ZhbC5yZW1haW4sXG4gICAgICBgJHtyZW1vdmFsLm1lc3NhZ2V9IC0gcmVtYWluaW5nIGludGVyYWN0aW9uLmhvbGRUaW1lcnMgaXMgY29ycmVjdGApXG4gIH1cblxuICB0LmVuZCgpXG59KVxuXG50ZXN0KCdwb2ludGVyRXZlbnRzIGRvd24gaG9sZCB1cCB0YXAnLCBhc3luYyAodCkgPT4ge1xuICBjb25zdCB7XG4gICAgaW50ZXJhY3Rpb24sXG4gICAgZXZlbnQsXG4gICAgaW50ZXJhY3RhYmxlLFxuICB9ID0gaGVscGVycy50ZXN0RW52KHsgcGx1Z2luczogW3BvaW50ZXJFdmVudHMsIGludGVyYWN0YWJsZVRhcmdldHMgXSB9KVxuXG4gIGNvbnN0IGZpcmVkOiBQb2ludGVyRXZlbnRbXSA9IFtdXG5cbiAgZm9yIChjb25zdCB0eXBlIG9mIHBvaW50ZXJFdmVudHMudHlwZXMpIHtcbiAgICBpbnRlcmFjdGFibGUub24odHlwZSwgKGUpID0+IGZpcmVkLnB1c2goZSkpXG4gIH1cblxuICBpbnRlcmFjdGlvbi5wb2ludGVyRG93bihldmVudCwgZXZlbnQsIGV2ZW50LnRhcmdldClcbiAgaW50ZXJhY3Rpb24ucG9pbnRlck1vdmUoZXZlbnQsIGV2ZW50LCBldmVudC50YXJnZXQpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgZmlyZWQubWFwKChlKSA9PiBlLnR5cGUpLFxuICAgIFsnZG93biddLFxuICAgICdkdXBsaWNhdGUgbW92ZSBldmVudCBpcyBub3QgZmlyZWQnKVxuXG4gIGNvbnN0IGhvbGRUaW1lciA9IGludGVyYWN0aW9uLnBvaW50ZXJzWzBdLmhvbGRcblxuICB0Lm9rKCEhaG9sZFRpbWVyLnRpbWVvdXQsICdob2xkIHRpbWVvdXQgaXMgc2V0JylcblxuICBhd2FpdCBoZWxwZXJzLnRpbWVvdXQoaG9sZFRpbWVyLmR1cmF0aW9uKVxuXG4gIGludGVyYWN0aW9uLnBvaW50ZXJVcChldmVudCwgZXZlbnQsIGV2ZW50LnRhcmdldCwgZXZlbnQudGFyZ2V0KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGZpcmVkLm1hcCgoZSkgPT4gZS50eXBlKSxcbiAgICBbJ2Rvd24nLCAnaG9sZCcsICd1cCcsICd0YXAnXSxcbiAgICAndGFwIGV2ZW50IGlzIGZpcmVkIGFmdGVyIGRvd24sIGhvbGQgYW5kIHVwIGV2ZW50cycpXG5cbiAgdC5lbmQoKVxufSlcbiJdfQ==